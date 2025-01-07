import { EntitySchema } from "typeorm";

export const Student = new EntitySchema({
    name: "Student",
    tableName: "students",
    columns: {
        id_student: {
            primary: true,
            type: "int",
            generated: true,
        },
        telephone: {
            type: "text",
            unique: true,
            nullable: false,
        },
        name: {
            type: "text",
            nullable: true,
        },
    },
});