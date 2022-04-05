from flask import Flask, request, jsonify
from flask_cors import CORS

import api

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})

#region Object

'''
Objet attendu pour silo :
{
    "name": "name",
    "description": "description",
}
'''

@app.route('/silo/', methods=['GET'])
def get_silo_objects():
    resp = api.get_silo_objects()
    return resp.content


@app.route('/silo/', methods=['PUT'])
def update_silo_objects():
    content = request.get_json()
    name = content["name"]
    description = content["description"]
    resp = api.update_silo_object(name, description)
    return jsonify(resp)


@app.route('/silo/reset/', methods=['GET'])
def reset_silo_object():
    resp = api.reset_silo_object()
    return jsonify(resp)

#endregion

#region Pointer

'''
Objet attendu pour pointer :
{
    "title": "title",
    "description": "description",
    "camera": {
        "position": [10,20,30],
        "target": [10,20,30]
    },
    "position": { 
        "x": 10,
        "y": 20,
        "z": 30
    }
}
'''

@app.route('/pointer/', methods=['POST'])
def create_pointer():
    content = request.get_json()
    resp = api.create_pointer(content)
    return jsonify(resp)


@app.route('/pointer/', methods=['GET'])
def get_pointers():
    resp = api.get_pointers()
    return resp.content


@app.route('/pointer/<id_pointer>', methods=['GET'])
def get_pointer(id_pointer: str):
    resp = api.get_pointer(id_pointer)
    return resp.content


@app.route('/pointer/<id_pointer>', methods=['PUT'])
def update_pointer(id_pointer: str):
    content = request.get_json()
    resp = api.update_pointer(id_pointer, content)
    return jsonify(resp)


@app.route('/pointer/<id_pointer>', methods=['DELETE'])
def delete_pointer(id_pointer: str):
    resp = api.delete_pointer(id_pointer)
    return jsonify(resp)

#endregion

if __name__ == '__main__':
   app.run(debug = True)
