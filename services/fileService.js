const fs = require("fs");
const path = require("path");
const File = require("../models/File");
const config = require("config");

class FileService {
  createDir(file) {
    const filePath = `${config.get("filePath")}/${file.user}/${file.path}`;

    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
          return resolve({ message: "File already created" });
        } else {
          return reject({ message: "File already exists" });
        }
      } catch (e) {
        console.log(e);
        return reject({ message: "File error" });
      }
    });
  }
  deleteFile(file) {
    const filePath = this.getPath(file);

    if (file.type === "dir") {
      this.deleteDirectory(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  }

  deleteDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const currentPath = path.join(dirPath, file);
        if (fs.lstatSync(currentPath).isDirectory()) {
          this.deleteDirectory(currentPath);
        } else {
          fs.unlinkSync(currentPath);
        }
      });

      fs.rmdirSync(dirPath);
    }
  }

  getPath(file) {
    return config.get("filePath") + "/" + file.user + "/" + file.path;
  }
}

module.exports = new FileService();
