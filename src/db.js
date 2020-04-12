import {schema as lovefield, Type} from 'lovefield';

export default class Db {
  constructor() {
    this.db = lovefield.create('platmaster', 1);
    this.db
      .createTable('settings')
      .addColumn('id', Type.INTEGER)
      .addColumn('color1', Type.STRING)
      .addColumn('color2', Type.STRING)
      .addColumn('colorText', Type.STRING)
      .addColumn('darkEditor', Type.BOOLEAN)
      .addPrimaryKey(['id'], true);
    this.db
      .createTable('history')
      .addColumn('id', Type.INTEGER)
      .addColumn('projectId', Type.STRING)
      .addColumn('type', Type.STRING)
      .addColumn('featureId', Type.STRING)
      .addPrimaryKey(['id'], true);
  }

  async insert(tableName, values, replace = false) {
    const table = this.db.getSchema().table(tableName);
    const props = {...values};
    if (!props.id) props.id = 0;
    const row = table.createRow(props);
    const query = (replace) ? this.db.insertOrReplace() : this.db.insert();
    return query.into(table).values([row]).exec();
  }

  async update(tableName, property, equals, values) {
    const table = this.db.getSchema().table(tableName);
    let query = this.db.update(table);
    for (let [column, value] of Object.entries(values)) {
      query = query.set(table[column], value);
    }
    return query.where(table[property].eq(equals)).exec();
  }

  async delete(tableName, property, equals) {
    const table = this.db.getSchema().table(tableName);
    return this.db.delete().from(table).where(table[property].eq(equals)).exec();
  }
};