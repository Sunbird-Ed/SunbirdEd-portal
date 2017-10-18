import os
import sys

if len(sys.argv) == 3:
        data = sys.argv[1]  #data to append
        filename = sys.argv[2] #input file name
        if os.path.isfile(filename):
                with open(filename,'r+') as f:
                        lines = f.readlines()
                        f.seek(0)
                        f.truncate()
                        for line in lines:
                                if "<link" in line:
                                        line = line.replace('href="','href="'+data)
                                elif "<script" in line:
                                        line = line.replace('src="','src="'+data)
                                f.write(line)
        else:
                print("inputfile "+filename+" not found")

else:
        print("Please enter 2 argumets(data to append, input file name)")