import {schema, Type} from 'lovefield';

export default class Db {
  constructor() {
    this.schema = schema.create('platmaster', 1);
    this.schema
      .createTable('history')
      .addColumn('id', Type.INTEGER)
      .addColumn('projectId', Type.STRING)
      .addColumn('type', Type.STRING)
      .addColumn('featureId', Type.STRING)
      .addPrimaryKey(['id'], true);
    this.schema
      .createTable('settings')
      .addColumn('id', Type.INTEGER)
      .addColumn('color1', Type.STRING)
      .addColumn('color2', Type.STRING)
      .addColumn('colorText', Type.STRING)
      .addColumn('darkEditor', Type.BOOLEAN)
      .addColumn('dateFormat', Type.STRING)
      .addColumn('timeFormat', Type.STRING)
      .addPrimaryKey(['id'], true);
    this.schema
      .createTable('templates')
      .addColumn('id', Type.STRING)
      .addColumn('bearingBasisDate', Type.DATE_TIME)
      .addColumn('bearingBasisType', Type.STRING)
      .addColumn('crs', Type.OBJECT)
      .addColumn('distanceBasisType', Type.STRING)
      .addColumn('distanceUnit', Type.OBJECT)
      .addColumn('lastUsed', Type.DATE_TIME)
      .addColumn('name', Type.STRING)
      .addPrimaryKey(['id'], false)
      .addNullable(['crs', 'bearingBasisDate']);
  }

  async delete(tableName, property, equals) {
    const table = this.db.getSchema().table(tableName);
    return this.db.delete().from(table).where(table[property].eq(equals)).exec();
  }

  async initialize() {
    this.db = await this.schema.connect();
  }

  async insert(tableName, values, replace = false) {
    console.log(tableName, values, replace);
    const table = this.db.getSchema().table(tableName);
    const props = {...values};
    if (!props.id) props.id = 0;
    const row = table.createRow(props);
    const query = (replace) ? this.db.insertOrReplace() : this.db.insert();
    return query.into(table).values([row]).exec();
  }

  async select(tableName, test = []) {
    const table = this.db.getSchema().table(tableName);
    const query = this.db.select().from(table);
    if (test.length > 0) {
      const [column, rel, value] = test;
      return query.where(table[column][rel](value)).exec();
    } else {
      return query.exec();
    }
    // for (let [column, rel, value] of tests) {
    //   query = query.where(table[column][rel](value));
    // }
  }

  async update(tableName, property, equals, values) {
    const table = this.db.getSchema().table(tableName);
    let query = this.db.update(table);
    for (let [column, value] of Object.entries(values)) {
      query = query.set(table[column], value);
    }
    return query.where(table[property].eq(equals)).exec();
  }
};