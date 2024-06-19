const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password as argument")
    process.exit(1);
}

// La contraseña para la conexion a la base de datos es proporcionada como parametro al ejecutar el programa `$node mongo.js <password>`
const password = process.argv[2]
const databaseName = "notesApp"

/**
 * La contraseña es añadida a la cadena de conexion `<username>:<password>`.
 * El nombre de la base de datos personalizado se añade la URI antes de `?retryWrites`.
 */
const url = `mongodb+srv://martindotdev:${password}@fullstackopencluster.asrmplj.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=FullStackOpenCluster`

mongoose.set("strictQuery", false)

mongoose.connect(url)

const noteSchema = mongoose.Schema({
    content: String,
    important: Boolean,
});

const Note = mongoose.model("Note", noteSchema)

const note = new Note({
    content: "HTML is easy",
    important: true,
});

note.save().then((result) => {
    console.log("note saved!")
    mongoose.connection.close()
});
