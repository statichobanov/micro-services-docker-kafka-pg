exports.shorthands = undefined;

exports.up = (pgm) => {
  // Creation of refresh_token foreign keys
  console.log("Creating refresh_token foreign keys");

  pgm.addConstraint(
    { schema: "public", name: "refresh_token" },
    "refresh_token_user_fk",
    {
      foreignKeys: {
        columns: "id_user",
        references: '"user"("id")',
      },
    }
  );

  console.log("Successfully refresh_token foreign keys");

  // Creation of order foreign keys
  console.log("Creating order foreign keys");

  pgm.addConstraint({ schema: "public", name: "order" }, "order_user_fk", {
    foreignKeys: {
      columns: "id_user",
      references: '"user"("id")',
    },
  });

  console.log("Successfully refresh_token foreign keys");

  // Creation of order_products foreign keys
  console.log("Creating order_products foreign keys");

  pgm.addConstraint(
    { schema: "public", name: "order_products" },
    "order_products_order_fk",
    {
      foreignKeys: {
        columns: "id_order",
        references: '"order"("id")',
        onDelete: "CASCADE",
      },
    }
  );
  pgm.addConstraint(
    { schema: "public", name: "order_products" },
    "order_products_product_fk",
    {
      foreignKeys: {
        columns: "id_product",
        references: '"product"("id")',
      },
    }
  );

  console.log("Successfully order_products foreign keys");
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    { schema: "public", name: "refresh_token" },
    "refresh_token_user_fk",
    {
      ifExists: true,
    }
  );

  pgm.dropConstraint({ schema: "public", name: "order" }, "order_user_fk", {
    ifExists: true,
  });

  pgm.dropConstraint(
    { schema: "public", name: "order_products" },
    "order_products_order_fk",
    {
      ifExists: true,
    }
  );

  pgm.dropConstraint(
    { schema: "public", name: "order_products" },
    "order_products_product_fk",
    {
      ifExists: true,
    }
  );
};
