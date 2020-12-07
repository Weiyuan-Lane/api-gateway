import fs from 'fs';

export default (filename: string): object => {
  const retrievedData: string = fs.readFileSync(filename, 'utf8') as string;
  const parsedData: object = JSON.parse(retrievedData);

  return parsedData;
};
