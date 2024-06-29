type dbClient = {
  uri: string;
};

export const mongoDbConfig: dbClient = {
  uri: process.env.MONGODB_URI as string,
};
