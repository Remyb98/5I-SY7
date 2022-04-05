import os
import json

import requests
from requests.structures import CaseInsensitiveDict
from dotenv import load_dotenv
load_dotenv()

TOKEN = os.getenv("TOKEN")
ID_OBJECT = os.getenv("OBJECT_ID")
HEADERS = CaseInsensitiveDict()
HEADERS["Authorization"] = f"Bearer {TOKEN}"
HEADERS["Content-Type"] = "application/json"


def _write_to_file(resp, name):
    """Fonction de test, écrit la réponse dans un fichier

    Args:
        resp (_type_): Objet réponse
        name (_type_): Nom du fichier
    """
    with open(f"{name}.json", "w") as f:
        f.write(str(resp.content.decode('utf-8')))


#region object

def get_silo_objects() -> list:
    """Renvoie la liste de tous les objets du silo

    Returns:
        list: Liste des objets
    """
    return requests.get("https://public-api.arskan.com/objects", headers=HEADERS)
    

def update_silo_object(name, description) -> bool:
    """Modifie le nom et la description de l'objet avec ceux passés en paramètre

    Args:
        name (_type_): Nom de l'objet
        description (_type_): Description

    Returns:
        bool: True si l'objet a été correctement modifié, False sinon
    """
    payload = json.dumps({
        "name": name,
        "description": description
    })
    resp = requests.put(f"https://public-api.arskan.com/objects/{ID_OBJECT}", data=payload, headers=HEADERS)
    return True if (204 == resp.status_code) else False


def reset_silo_object():
    return update_silo_object(
        "The Hallwyl Museum 1st Floor Combined",
        "50Mo, CC License (https://creativecommons.org/licenses/by/4.0/)"
    )

#endregion

#region pointers

def create_pointer(data: dict) -> str:
    """Créé un nouveau pointeur

    Args:
        data (dict): Dictionnaire avec clés "title", "description", "camera", "position" 

    Returns:
        str: Id du nouveau pointeur, 0 s'il y a eu un problème durant la création
    """
    payload = json.dumps({
        "title": data["title"],
        "description": data["description"],
        "camera": data["camera"],
        "position": data["position"]
    })
    resp = requests.post(f"https://public-api.arskan.com/objects/{ID_OBJECT}/pointers", data=payload, headers=HEADERS)
    return True if 204 == resp.status_code else False


def get_pointers():
    """Renvoie la liste des pointeurs

    Returns:
        _type_: Liste des pointeurs
    """
    return requests.get(f"https://public-api.arskan.com/objects/{ID_OBJECT}/pointers", headers=HEADERS)


def get_pointer(id: str):
    """Renvoie le pointeur correspondant à l'id

    Args:
        id (str): Id pointeur

    Returns:
        _type_: Pointeur
    """
    return requests.get(f"https://public-api.arskan.com/pointers/{id}", headers=HEADERS)


def update_pointer(id: str, data: dict):
    """Modifie le pointeur avec les données passées en paramètre

    Args:
        id (str): Id pointeur
        data (dict): Dictionnaire avec clés "title", "description", "camera", "position"  

    Returns:
        _type_: True si le pointeur a été correctement modifié, False sinon
    """
    payload = json.dumps({
        "title": data["title"],
        "description": data["description"],
        "camera": data["camera"],
        "position": data["position"]
    })
    resp = requests.put(f"https://public-api.arskan.com/pointers/{id}", data=payload, headers=HEADERS)
    return True if 204 == resp.status_code else False


def delete_pointer(id: str) -> bool:
    """Supprime le pointeur correspondant à l'id

    Args:
        id (str): Id pointeur 

    Returns:
        bool: True si l'objet a été correctement modifié, False sinon
    """
    resp = requests.delete(f"https://public-api.arskan.com/pointers/{id}", headers=HEADERS)
    return True if 204 == resp.status_code else False

#endregion

def test():
    update_silo_object("test_name", "description depuis python")
    dict_val = {
        "title": "created pointer name",
        "description": "created pointer description",
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
    create_pointer(dict_val)


if __name__ == '__main__':
    test()
