// Storage interface - not currently used for this chat application
// Chat messages are handled in-memory on the frontend

export interface IStorage {}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
