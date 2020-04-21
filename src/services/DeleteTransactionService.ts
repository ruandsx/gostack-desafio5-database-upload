import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const findTransaction = await transactionsRepository.findOne(id);

    if (!findTransaction) {
      throw new AppError('Transaction not found');
    }

    await transactionsRepository.remove(findTransaction);
  }
}

export default DeleteTransactionService;
