#!/bin/bash
# Install python
apt update && apt install -y python3.7 build-essential

export PYTHON=/usr/bin/python3.7
# ARGUMENTS copy=false build=false yarn=false
# https://stackoverflow.com/questions/46354149/how-do-i-parse-command-line-argumentsas-key-value-pair-in-bash-with-arguments
for argument; do #syntactic sugar for: for argument in "$@"; do
    key=${argument%%=*}
    value=${argument#*=}

    echo "$key"
    echo "$value"
    echo "*******************"

    case "$key" in

        copy)    copy=$value;;
        build)   build=$value;;
        yarn)   yarn=$value;;
    esac
done

# sample of IF condition
# if [ $yarn == true ]
#   then
#     echo $yarn
# fi

# start with a try
{
  i=1;
  for user in "$@"
  do
      echo "input arguments - $i: $user";
      i=$((i + 1));
  done

  cmd_prefix="DESKTOP_BUILD"
  function printLog {
    echo $cmd_prefix: $1
  }

  function checkArgument {
    if [ $yarn == false ]
      then
        echo "SKIPPED - $1 $2 $3"
      else
          $1 $2 $3
      fi
  }

  printLog "Running build.";

  if [ $build == true ]
    then
    cd /offline/src/app

    else
      cd /offline/src/desktop
      rm -rf app_dist
      printLog "Removed app_dist successfully."


      cd ../app/client
      checkArgument yarn install

      printLog "Build prod desktop build."
      checkArgument npm run prod-desktop
      cd ..
  fi


  yarn install
  npm run  resource-bundles
  cd ../desktop/OpenRAP
  yarn install

  printLog "Packaging OpenRAP"
  npm run pack
  cd ..
  yarn --update-checksums
  yarn install

  printLog "Starting tsc to compile/execute tsconfig.json"
  npm run build-ts

  printLog "Copying all the the required files to output app_dist folder"

  set -e
  node scripts/copy.js


  printLog "Generating TAR file from app_dist"
  # Tar the generic build files
  tar -czvf app_dist.tar.gz app_dist

  printLog "Desktop build successfully generated"
  # make sure to clear $ex_code, otherwise catch * will run
  # echo "finished" does the trick for this example
  echo "finished"
# directly after closing the subshell you need to connect a group to the catch using ||
} || {
    # now you can handle
    case $ex_code in
        $AnException)
            echo "AnException was thrown"
        ;;
        $AnotherException)
            echo "AnotherException was thrown"
        ;;
        *)
            echo "An unexpected exception was thrown"
            throw $ex_code # you can rethrow the "exception" causing the script to exit if not caught
        ;;
    esac

    exit 1;
}
