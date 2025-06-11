import { query } from '../db/db_manager.js';


async function updateRoomsWithCoordinates() {

    let room1 = {
        id: 1,
        geom: {
            "type": "Polygon",
            "coordinates": [
                [
                    [4.871722, 45.779790], [4.871881, 45.779826], [4.871754, 45.780099],
                    [4.871596, 45.780064], [4.871722, 45.779790]
                ]
            ],
        }
    }

    let room2 = {
        id: 2,
        geom: {
            "type": "Polygon",
            "coordinates": [
                [
                    [4.871706, 45.780215], [4.871541, 45.780173], [4.871427, 45.780422],
                    [4.871592, 45.780456], [4.871706, 45.780215]
                ]
            ],
        }
    }

    for (let room of [room1, room2]) {
        await query('UPDATE rooms SET geom = St_AsText(ST_GeomFromGeoJson($1)) WHERE id = $2', [room.geom, room.id]);
    }
}

async function addDevices() {

    let lamp1 = {
        type: "lamp",
        status: "on",
        geom: {
            "type": "Point",
            "coordinates": [4.871766, 45.779908],
        }
    }

    let lamp2 = {
        type: "lamp",
        status: "off",
        geom: {
            "type": "Point",
            "coordinates": [4.871535, 45.780390],
        }
    }

    let thermometer1 = {
        type: "thermometer",
        status: "32",
        geom: {
            "type": "Point",
            "coordinates": [4.871610, 45.780231],
        }
    }


    let thermometer2 = {
        type: "thermometer",
        status: "17",
        geom: {
            "type": "Point",
            "coordinates": [4.871696, 45.780041],
        }
    }


    for (let device of [lamp1, lamp2, thermometer1, thermometer2]) {
        await query('INSERT INTO devices (type, geom, status) VALUES ($1, $2, $3)', [device.type, device.geom, device.status]);
    }
}





export { updateRoomsWithCoordinates, addDevices };
