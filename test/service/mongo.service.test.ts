import test, { after, afterEach, describe } from 'node:test';
import assert from 'node:assert';
import mongoService from '../../src/service/mongo.service.js';
import sinon from 'sinon';
import { MongoClient } from 'mongodb';

describe('MongoService', () => {

  afterEach(() => {
    sinon.restore();
  });

  test('should throw error if instance is created multiple times', () => {
    assert.throws(() => new (mongoService.constructor as any)(), TypeError, 'client is already an instance');
  });

  test('should return collection', async () => {
    // Arrange
    const collectionStub = sinon.stub().returns([]);
    const dbStub = sinon.stub(MongoClient.prototype, 'db').returns({ collection: collectionStub } as any);

    //Act
    const items = mongoService.getCollection('test-collection') as any as [];

    //Assert
    assert.ok(dbStub.calledOnce);
    assert.ok(collectionStub.calledOnce);
    assert.equal(0, items.length);
  });
});