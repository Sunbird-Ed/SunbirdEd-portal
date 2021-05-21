import FileSDK from './FileSDK';
import * as fs from 'fs';
import * as path from 'path';
const chai = require('chai'), spies = require('chai-spies');
chai.use(spies);
const spy = chai.spy.sandbox();
const expect = chai.expect;
const data = 'test data'

describe('FileSDK', () => {
  let fileSDK;
  process.env.FILES_PATH = path.join(__dirname, '..', 'test_data');
  beforeEach(async () => {
    fileSDK = new FileSDK("testPlugin");
  });
  afterEach(async () => {
    spy.restore();
  })

  process.env.FILES_PATH = path.join(__dirname, '..', 'test_data');
  it('should create test directory', (done) => {
    Promise
      .all([fileSDK.mkdir('test1'), fileSDK.mkdir('test2')])
      .then(() => {
        let stats1 = fs.statSync(fileSDK.getAbsPath('test1'));
        console.log(fileSDK.getAbsPath('test1'))
        expect(stats1.isDirectory()).to.be.true;
        let stats2 = fs.statSync(fileSDK.getAbsPath('test2'));
        expect(stats2.isDirectory()).to.be.true;
        done();
      })


  });

  it('should copy file', async () => {
    let sourceFilePath = path.join(fileSDK.getAbsPath('test1'), 'test.txt');
    let destFilePath = path.join(fileSDK.getAbsPath('test2'), 'copied.txt');

    fs.appendFileSync(sourceFilePath, data);
    await fileSDK.copy(sourceFilePath, destFilePath);
    let destData = fs.readFileSync(destFilePath, { encoding: 'utf8' });
    expect(data).to.be.equal(destData);
  })

  it('should move file', async () => {
    let sourceFilePath = path.join('test2', 'copied.txt');
    let destFilePath = path.join('test1', 'moved.txt');
    await fileSDK.move(sourceFilePath, destFilePath)
    let destData = fs.readFileSync(path.join(fileSDK.getAbsPath('test1'), 'moved.txt'), { encoding: 'utf8' });
    expect(data).to.be.equal(destData);
  })

  it('should remove file', async () => {
    let Path = path.join('test1', 'moved.txt');
    await fileSDK.remove(Path);
  })

  it('should zip file', async () => {
    let src = path.join('test1', 'test.txt');
    await fileSDK.zip(src, 'test1', 'test.zip');
  })

  it('should unzip file', async () => {
    let dest = 'test2';
    let src = path.join('test1', 'test.zip');
    await fileSDK.unzip(src, dest, false);
  })

  it('should zip folder', async () => {
    let src = 'test1';
    let dest = 'test-folder.zip';
    await fileSDK.zip(src, '', dest);
  })

  it('should unzip folder', async () => {
    let dest = 'test-folder';
    let src = 'test-folder.zip';
    await fileSDK.unzip(src, dest, false);
  })

  it('should watch folder', (done) => {
    let Path = fileSDK.getAbsPath('test-folder');
    let watcher = fileSDK.watch([Path])
    watcher
      .on('all', (event, path, details) => {
        console.log('event', event, path)
      })

    setTimeout(() => {
      fs.appendFileSync(path.join(Path, 'data.txt'), "aksjfgjhaksgf");

    }, 500)

    setTimeout(() => {
      watcher.close();
      done();
    }, 700)

  })

  it('should remove directory', (done) => {
   fileSDK.remove('').then(done);
  })

});