import csvParser from 'csv-parser';
import fs from 'fs';

const parseCSV = (filePath, deleteFile = true) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        if (deleteFile)
            fs.unlinkSync(filePath); // remove temp file
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export default parseCSV;