import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

type PalindromeResult = BadRequestException | boolean;

@Injectable()
export class PalindromeService {
  private readonly logger = new Logger(PalindromeService.name);
  private readonly palindromeSchema = z.string().min(2);
  private readonly palindromeCache: Map<string, PalindromeResult> = new Map();

  async getIsPalindrome(word: string) {
    const trimmedWord = word.trim();

    let result = this.getIsPalindromeFromCache(trimmedWord);

    if (result !== null) {
      return {
        result,
      };
    }

    const parsedWord = this.palindromeSchema.safeParse(trimmedWord);

    if (!parsedWord.success) {
      const exception = new BadRequestException('Invalid word');
      this.logger.log('Storing exception in cache');
      this.palindromeCache.set(trimmedWord, exception);

      throw exception;
    }

    result = this.calculateIsPalindrome(parsedWord.data);

    return {
      result,
    };
  }

  private calculateIsPalindrome(word: string) {
    let result = true;
    let right = word.length - 1;
    const half = word.length / 2;

    for (let left = 0; left < half; left++) {
      if (word[left] !== word[right]) {
        result = false;
        break;
      }
      right--;
    }

    this.logger.log(`Caching palindrome result for word: ${word}`);
    this.palindromeCache.set(word, result);
    return result;
  }

  private getIsPalindromeFromCache(word: string) {
    if (this.palindromeCache.has(word)) {
      this.logger.log(`Cache hit for word: ${word}`);
      const result = this.palindromeCache.get(word);

      if (typeof result === 'boolean') {
        return result;
      }

      this.logger.log('Cache hit with exception');
      throw result;
    }

    this.logger.log(`Cache miss for word: ${word}`);

    return null;
  }
}
