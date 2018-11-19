import * as path from 'path';
import { Store, IStore } from '../../../Store';
import { Bucket } from '../../../Bucket';
import { Path } from '../../sitecore/Path';
import { UpdateItemOp } from '../../ops/UpdateItemOp';
import { MemoryDb } from '../MemoryDb';
import { ItemMetaData, IItem } from '../../../model/Sitecore';
import { DeleteItemOp } from '../../ops/DeleteItemOp';
import { CreateItemOp } from '../../ops/CreateItemOp';

describe('MemoryDb', () => {
  let store: IStore;

  beforeEach(() => {
    store = new Store();
    const bucket = new Bucket(path.resolve(__dirname, './data'), '/sitecore/templates/Helix/Project', 'master');
    store.addBucket(bucket);
  });

  function createSimpleItem(meta?: ItemMetaData, props: any = {ID: '11111111-1111-1111-1111-111111111111'}): IItem {
    return store.createItemFromObject({
      Parent: '228d3c60-152b-c3e3-f136-684c4d06d061',
      Template: '0437fee2-44c9-46a6-abe9-28858d9fee8c',
      Path: '/sitecore/templates/Helix/Project/TestProject/Test',
      DB: 'master',
      SharedFields: [
        {
          ID: '06d5295c-ed2f-4a54-9bf2-26228d113318',
          Hint: '__Icon',
          Value: 'office/32x32/document_tag.png',
        }
      ],
      ...props,
    }, meta);
  }

  it('should create a new item with an existing id', () => {
    const item = createSimpleItem();
    expect(item.ID).toBe('11111111-1111-1111-1111-111111111111');
    expect(store.getDatabase('master')!.operationCount()).toBe(1);
  });

  it('should create a new item with a new deterministic guid', () => {
    const item = createSimpleItem(undefined, {});
    expect(item.ID).toBe('373ab580-af7d-40b0-89fe-b12a329fdc11');
    expect(store.getDatabase('master')!.operationCount()).toBe(1);
  });

  it('should create an update operation on an existing item when the path changes', () => {
    const item = createSimpleItem({
      isNew: false,
      isDirty: false,
    });
    item.Path = new Path('/sitecore/templates/Helix/Project/TestProject/Test Update');

    const db = store.getDatabase('master');
    expect(db).toBeInstanceOf(MemoryDb);
    expect(db!.operationCount()).toBe(1);
    
    const op = db!.operations[0];
    expect(op).toBeInstanceOf(UpdateItemOp);
    expect((op as UpdateItemOp).changed.has('Path')).toBe(true);
  });

  it('should create an update operation on an existing item when a shared field changes', () => {
    const item = createSimpleItem({
      isNew: false,
      isDirty: false,
    });
    item.SharedFields[0].Value = 'test.png';

    const db = store.getDatabase('master');
    expect(db).toBeInstanceOf(MemoryDb);
    expect(db!.operationCount()).toBe(1);
    
    const op = db!.operations[0];
    expect(op).toBeInstanceOf(UpdateItemOp);
    expect((op as UpdateItemOp).changed).toEqual(new Map([['SharedFields.0.Value', ['office/32x32/document_tag.png', 'test.png']]]));
  });

  it('should create update operations on existing items when the id changes', () => {
    const item = createSimpleItem({
      isNew: false,
      isDirty: false,
    });

    createSimpleItem({
      isNew: false,
      isDirty: false,
    }, {
      Parent: '11111111-1111-1111-1111-111111111111',
      Path: '/sitecore/templates/Helix/Project/TestProject/Test/Child',
    });

    // Change the parent id
    item.ID = store.generateId('blank src');

    const db = store.getDatabase('master');
    expect(db).toBeInstanceOf(MemoryDb);
    expect(db!.operationCount()).toBe(2);
    
    let op = db!.operations[0];
    expect(op).toBeInstanceOf(UpdateItemOp);
    expect((op as UpdateItemOp).changed).toEqual(new Map([['ID', ["11111111-1111-1111-1111-111111111111", "c8bab560-9df1-4b3c-8379-e179d6e6dc5e"]]]));

    op = db!.operations[1];
    expect(op).toBeInstanceOf(UpdateItemOp);
    expect((op as UpdateItemOp).changed).toEqual(new Map([['Parent', ["11111111-1111-1111-1111-111111111111", "c8bab560-9df1-4b3c-8379-e179d6e6dc5e"]]]));
  });

  it('should create update operations on existing items when the path changes', () => {
    const item = createSimpleItem({
      isNew: false,
      isDirty: false,
    });

    const child = createSimpleItem({
      isNew: false,
      isDirty: false,
    }, {
      Parent: '11111111-1111-1111-1111-111111111111',
      Path: '/sitecore/templates/Helix/Project/TestProject/Test/Child',
    });

    // Change the parent path
    item.Path = new Path('/sitecore/template/Helix/Project/TestProject/TestRenamed')

    expect(child.Path.Path).toBe('/sitecore/template/Helix/Project/TestProject/TestRenamed/Child');

    const db = store.getDatabase('master');
    expect(db).toBeInstanceOf(MemoryDb);
    expect(db!.operationCount()).toBe(2);

    let op = db!.operations[0];
    expect(op).toBeInstanceOf(UpdateItemOp);
    // expect((op as UpdateItemOp).changed).toEqual(new Map([['ID', ["11111111-1111-1111-1111-111111111111", "c8bab560-9df1-4b3c-8379-e179d6e6dc5e"]]]));

    op = db!.operations[1];
    expect(op).toBeInstanceOf(UpdateItemOp);
    // expect((op as UpdateItemOp).changed).toEqual(new Map([['Parent', ["11111111-1111-1111-1111-111111111111", "c8bab560-9df1-4b3c-8379-e179d6e6dc5e"]]]));
  });

  it('should create a delete item operation', () => {
    const item = createSimpleItem({
      isNew: false,
      isDirty: false,
    });

    const db = store.getDatabase('master');

    expect(db).toBeInstanceOf(MemoryDb);

    db!.removeItem(item);

    expect(db!.operationCount()).toBe(1);
    
    const op = db!.operations[0];
    expect(op).toBeInstanceOf(DeleteItemOp);
  });

  it('should not create a delete item operation', () => {
    const item = createSimpleItem({
      isNew: true,
      isDirty: false,
    });

    expect(item.Meta.isNew).toBe(true);

    const db = store.getDatabase('master');

    expect(db).toBeInstanceOf(MemoryDb);

    db!.removeItem(item);

    expect(db!.operationCount()).toBe(0);
  });

  it('should create a create item operation', () => {
    const item = createSimpleItem({
      isNew: true,
      isDirty: false,
    });

    expect(item.Meta.isNew).toBe(true);

    const db = store.getDatabase('master');
    expect(db).toBeInstanceOf(MemoryDb);

    expect(db!.operationCount()).toBe(1);

    const op = db!.operations[0];
    expect(op).toBeInstanceOf(CreateItemOp);
  });

  it('should not create a create item operation', () => {
    const item = createSimpleItem({
      isNew: false,
      isDirty: false,
    });

    expect(item.Meta.isNew).toBe(false);

    const db = store.getDatabase('master');
    expect(db).toBeInstanceOf(MemoryDb);
    expect(db!.operationCount()).toBe(0);
  });

});