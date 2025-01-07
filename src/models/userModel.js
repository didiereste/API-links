import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        email: {
            type: "text",
            unique: true,
            nullable: false,
        },
        password: {
            type: "text",
            nullable: false,
        },
    },
});