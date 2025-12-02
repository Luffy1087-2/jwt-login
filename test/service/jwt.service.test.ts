import test, { afterEach, describe } from 'node:test';
import assert from 'node:assert';
import * as jwtService from '../../src/service/jwt.service.js';
import db from '../../src/service/mongo.service.js';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';

describe('jwt service', () => {

  afterEach(() => {
    sinon.restore();
  });

  describe('invalidateRefreshToken', () => {
    test('should throw error if refresh token is invalid', async () => {
      await assert.rejects(() => jwtService.invalidateRefreshToken(''), TypeError, 'invalid refresh token');
    });

    test('should throw error if jwt verify fails - 0', async () => {
      sinon.stub(jwt, 'verify').throws(new Error('invalid token'));
      const result = await jwtService.invalidateRefreshToken('invalid-token').catch(() => 0);
      assert.equal(0, result);
    });

    test('should throw error if jwt verify fails - 1', async () => {
      sinon.stub(jwt, 'verify').returns(undefined);
      const result = await jwtService.invalidateRefreshToken('invalid-token').catch(() => 0);
      assert.equal(0, result);
    });

    test('should delete token from database', async () => {
      const refreshToken = 'valid-token';
      const user = { sub: '123' };
      sinon.stub(jwt, 'verify').returns(user as any);
      const validTokens = { findOne: sinon.stub().returns({ _id: '123' }), deleteOne: sinon.stub() };
      sinon.stub(db, 'getCollection').returns(validTokens as any);
      await jwtService.invalidateRefreshToken(refreshToken);
      assert(validTokens.deleteOne.calledOnce);
    });
  });

  describe('addRefreshToken', () => {
    test('should throw error if refresh token is invalid', async () => {
      await assert.rejects(() => jwtService.addRefreshToken(''), TypeError, 'invalid refresh token');
    });

    test('should throw error if jwt verify fails - 0', async () => {
      sinon.stub(jwt, 'verify').throws(new Error('invalid token'));
      const result = await jwtService.addRefreshToken('invalid-token').catch(() => 0);
      assert.equal(0, result);
    });

    test('should throw error if jwt verify fails - 1', async () => {
      sinon.stub(jwt, 'verify').returns(undefined);
      const result = await jwtService.addRefreshToken('invalid-token').catch(() => 0);
      assert.equal(0, result);
    });

    test('should insert token into database if not exists', async () => {
      const refreshToken = 'valid-token';
      const user = { sub: '123' };
      sinon.stub(jwt, 'verify').returns(user as any);
      const validTokens = { findOne: sinon.stub().returns(null), insertOne: sinon.stub() };
      sinon.stub(db, 'getCollection').returns(validTokens as any);
      await jwtService.addRefreshToken(refreshToken);
      assert(validTokens.insertOne.calledOnce);
    });

    test('should update token in database if exists', async () => {
      const refreshToken = 'valid-token';
      const user = { sub: '123' };
      sinon.stub(jwt, 'verify').returns(user as any);
      const validTokens = { findOne: sinon.stub().returns({ sub: '123' }), updateOne: sinon.stub() };
      sinon.stub(db, 'getCollection').returns(validTokens as any);
      await jwtService.addRefreshToken(refreshToken);
      assert(validTokens.updateOne.calledOnce);
    });
  });

  describe('isInWhiteList', () => {
    test('should throw error if refresh token is invalid', async () => {
      await assert.rejects(() => jwtService.isInWhiteList(''), TypeError, 'invalid refresh token');
    });

    test('should throw error if jwt verify fails-  0', async () => {
      sinon.stub(jwt, 'verify').throws(new Error('invalid token'));
      const result = await jwtService.isInWhiteList('invalid-token').catch(() => 0);
      assert.equal(0, result);
    });

    test('should throw error if jwt verify fails - 1', async () => {
      sinon.stub(jwt, 'verify').returns(undefined);
      const result = await jwtService.isInWhiteList('invalid-token').catch(() => 0);
      assert.equal(0, result);
    });

    test('should return true if token is in whitelist', async () => {
      const refreshToken = 'valid-token';
      const user = { sub: '123' };
      sinon.stub(jwt, 'verify').returns(user as any);
      const validTokens = { findOne: sinon.stub().returns({ refreshToken }) };
      sinon.stub(db, 'getCollection').returns(validTokens as any);
      const result = await jwtService.isInWhiteList(refreshToken);
      assert.strictEqual(result, true);
    });

    test('should return false if token is not in whitelist', async () => {
      const refreshToken = 'valid-token';
      const user = { sub: '123' };
      sinon.stub(jwt, 'verify').returns(user as any);
      const validTokens = { findOne: sinon.stub().returns(null) };
      sinon.stub(db, 'getCollection').returns(validTokens as any);
      const result = await jwtService.isInWhiteList(refreshToken);
      assert.strictEqual(result, false);
    });
  });
});