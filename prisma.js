// import { PrismaClient } from '@prisma/client';
const prisma = require('@prisma/client');

const { PrismaClient } = prisma;
const db = new PrismaClient();

module.exports = db;
