exports.shorthands = undefined;

exports.up = (pgm) => {
  // Creation of user table
  console.log("Creating table user");

  pgm.createTable(
    { schema: "public", name: "user" },
    {
      id: {
        type: "uuid",
        primaryKey: true,
        notNull: true,
        default: pgm.func("gen_random_uuid()"),
      },
      username: { type: "varchar(255)", notNull: true, unique: true },
      password: { type: "varchar(500)", notNull: true },
      first_name: { type: "varchar(150)", notNull: true },
      last_name: { type: "varchar(150)", notNull: true },
    }
  );

  console.log("Successfully created table user\n");

  // Creation of user refresh_token
  console.log("Creating table refresh_token");
  pgm.createTable(
    { schema: "public", name: "refresh_token" },
    {
      id: {
        type: "uuid",
        primaryKey: true,
        notNull: true,
        default: pgm.func("gen_random_uuid()"),
      },
      id_user: { type: "uuid", notNull: true, unique: true },
      token: { type: "varchar(1000)", notNull: true },
      expires: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("now() + interval '30 minutes'"),
      },
    }
  );

  console.log("Successfully created table refresh_token\n");

  // Creation of user product
  console.log("Creating table product");
  pgm.createTable(
    { schema: "public", name: "product" },
    {
      id: {
        type: "uuid",
        primaryKey: true,
        notNull: true,
        default: pgm.func("gen_random_uuid()"),
      },
      name: { type: "varchar(300)", notNull: true, unique: true },
      price: { type: "numeric", notNull: true },
      quantity: { type: "integer", notNull: true },
    }
  );

  console.log("Successfully created table product\n");

  // Creation of user order
  console.log("Creating table order");
  pgm.createTable(
    { schema: "public", name: "order" },
    {
      id: {
        type: "uuid",
        primaryKey: true,
        notNull: true,
        default: pgm.func("gen_random_uuid()"),
      },
      id_user: { type: "uuid", notNull: true },
      status: { type: "varchar(300)", notNull: true },
    }
  );

  console.log("Successfully created table order\n");

  // Creation of user order_products
  console.log("Creating table order_products");
  pgm.createTable(
    { schema: "public", name: "order_products" },
    {
      id_order: { type: "uuid", primaryKey: true, notNull: true },
      id_product: { type: "uuid", primaryKey: true, notNull: true },
      quantity: { type: "integer", notNull: true },
    }
  );

  console.log("Successfully created table order_products\n");
};

exports.down = (pgm) => {
  pgm.dropTable(
    { schema: "public", name: "order_products" },
    {
      ifExists: true,
    }
  );

  pgm.dropTable(
    { schema: "public", name: "product" },
    {
      ifExists: true,
    }
  );

  pgm.dropTable(
    { schema: "public", name: "order" },
    {
      ifExists: true,
    }
  );

  pgm.dropTable(
    { schema: "public", name: "refresh_token" },
    {
      ifExists: true,
    }
  );

  pgm.dropTable(
    { schema: "public", name: "user" },
    {
      ifExists: true,
    }
  );
};
