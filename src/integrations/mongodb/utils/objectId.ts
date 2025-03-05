
/**
 * Provides a browser-compatible implementation of MongoDB's ObjectId
 */
import { v4 as uuidv4 } from 'uuid';

// Mock ObjectId for browser compatibility
export class ObjectId {
  private id: string;

  constructor(id?: string) {
    this.id = id || uuidv4();
  }

  toString() {
    return this.id;
  }

  equals(other: ObjectId) {
    return this.id === other.id;
  }
}
