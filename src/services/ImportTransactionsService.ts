import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const realFilePath = path.join(uploadConfig.directory, filePath);

    const csvReader = fs.createReadStream(realFilePath);

    const parsers = csvParse({
      delimiter: ',',
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = csvReader.pipe(parsers);

    const lines = [];

    const createTransaction = new CreateTransactionService();

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const promises = lines.map(async line => {
      const [title, type, value, category] = line;
      const transaction = await createTransaction.execute({
        title,
        value,
        type,
        category,
      });
      return transaction;
    });

    const transactions = Promise.all(promises);

    return transactions;
  }
}

export default ImportTransactionsService;
