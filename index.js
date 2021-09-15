const path = require("path");
const fs = require("fs");

module.exports = class file {
  list(dir, details = false) {
    dir = fixPath(dir);
    let thisClass = this;
    return new Promise(function (resolve, reject) {
      fs.readdir(dir, function (err, files) {
        if (err) {
          reject(err);
        } else {
          if (details) {
            Promise.all(
              files.map(
                async (element) =>
                  await thisClass.info(fixPath(dir + "/" + element))
              )
            ).then(files_details => resolve(files_details));
          } else resolve(files);
        }
      });
    });
  }

  createDir(dir) {
    return new Promise(function (resolve, reject) {
      dir = fixPath(dir);
      fs.mkdir(dir, function (err) {
        if (err) {
          reject(err);
        } else resolve("Directory created successfully");
      });
    });
  }

  deleteDir(dir, force = false) {
    return new Promise(function (resolve, reject) {
      dir = fixPath(dir);
      fs.rmdir(dir, { recursive: force }, function (err) {
        if (err) {
          reject(err);
        } else resolve("Directory created successfully");
      });
    });
  }

  readFile(dir, encoding = "utf8") {
    return new Promise(function (resolve, reject) {
      dir = fixPath(dir);
      fs.readFile(dir, encoding, function (err, file) {
        if (err) {
          reject(err);
        } else resolve(file);
      });
    });
  }

  writeFile(dir, data, encoding = "utf8") {
    return new Promise(function (resolve, reject) {
      dir = fixPath(dir);
      fs.writeFile(dir, data, encoding, function (err) {
        if (err) {
          reject(err);
        } else resolve("File written successfully");
      });
    });
  }

  info(dir) {
    return new Promise(function (resolve, reject) {
      dir = fixPath(dir);
      fs.stat(dir, function (err, state) {
        let extension = fs.lstatSync(dir).isDirectory() ? "directory" : path.extname(dir)
        if (err) {
          reject(err);
        } else resolve({ name: path.basename(dir), type: extension, size: state.size });
      });
    });
  }

  fixPath = fixPath
};


function fixPath(paths) {
  let root = path.dirname(require.main.filename || process.mainModule.filename);
  return path.join( paths.replace("./", root + "/"));
}
