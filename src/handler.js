
const { nanoid } = require('nanoid')
const notes = require('./notes')

const addNoteHandler = (req, h) => {
    const { title, tags, body } = req.payload

    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    }

    notes.push(newNote)

    const isSuccess = notes.filter((note) => note.id === id).length > 0

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id
            }
        }).code(201)

        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan'
    }).code(500)

    return response
}

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes
    }
})

const getNoteByIdHandler = (req, h) => {
    const { id } = req.params

    const note = notes.filter((note) => note.id === id)[0]

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note
            }
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan'
    }).code(404)

    return response
}

const editNoteByIdHandler = (req, h) => {
    const { id } = req.params
    const { title, tags, body } = req.payload
    const updatedAt = new Date().toISOString()

    const index = notes.findIndex((note) => note.id === id)

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt
        }

        return h.response({
            status: 'success',
            message: 'Catatan berhasil diperbaharui',
            data: {
                note: notes[index]
            }
        }).code(200)
    }

    return h.response({
        status: 'fail',
        message: 'Gagal memperbaharui catatan. Id tidak ditemukan'
    }).code(404)
}

const deleteNoteByIdHandler = (req, h) => {
    const { id } = req.params

    const index = notes.findIndex((note) => note.id === id)

    if (index !== -1) {
        notes.splice(index, 1)

        return h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus'
        }).code(200)
    }

    return h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan'
    }).code(404)
}

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler }
