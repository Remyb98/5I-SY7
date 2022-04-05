const BASE_URL = "http://localhost:5000"

let currentObj;
let pointers;

/**
 * DOM chargé, on recupère les objets du silo
 */
document.addEventListener("DOMContentLoaded", () => {
    getObjects();
});

/**
 * Modification d'un objet du silo
 */
$("#update-button").click(() => {
    $("#name-edit").attr("value", currentObj.name);
    $("#desc-edit").attr("value", currentObj.description);
});

/**
 * Modifications d'un objet du silo
 */
$("#edit-button-form").click(() => {
    const payload = {
        name: $("#name-edit").val(),
        description: $("#desc-edit").val()
    };

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `${BASE_URL}/silo/`,
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify(payload)
    };

    $.ajax(settings).done(response => {
        console.log(response);
        getObjects();
        let toast = $("#toast");
        toast.show()
        setTimeout(() => toast.hide(), 2000);
    });
});

/**
 * Reset notre objet
 */
$("#reset-button").click(() => {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `${BASE_URL}/silo/reset`,
        "method": "GET",
        "headers": {}
    };

    $.ajax(settings).done(response => {
        console.log(response);
        getObjects();
        let toast = $("#toast");
        toast.show()
        setTimeout(() => toast.hide(), 2000);
    });
});

/**
 * Modification d'un pointer
 */
$("#pointer-button-form").click(() => {
    const payload = {
        "title": $("#name-pointer").val(),
        "description": $("#desc-pointer").val(),
        "camera": {
            "position": [
                $("#pos-cam-x-pointer").val(),
                $("#pos-cam-y-pointer").val(),
                $("#pos-cam-z-pointer").val()
            ],
            "target": [
                $("#pos-target-x-pointer").val(),
                $("#pos-target-y-pointer").val(),
                $("#pos-target-z-pointer").val()
            ]
        },
        "position": {
            "x": $("#pos-x-pointer").val(),
            "y": $("#pos-y-pointer").val(),
            "z": $("#pos-z-pointer").val()
        }
    };

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `${BASE_URL}/pointer/${$("#id-pointer").val()}`,
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify(payload)
    };

    $.ajax(settings).done(response => {
        console.log(response);
        loadPointers();
        let toast = $("#toast");
        toast.show()
        setTimeout(() => toast.hide(), 2000);
    });
});

/**
 * Suppression d'un pointer
 */
$("#pointer-delete-form").click(() => {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `${BASE_URL}/pointer/${$("#id-pointer").val()}`,
        "method": "DELETE",
        "headers": {}
    };

    $.ajax(settings).done(response => {
        console.log(response);
        loadPointers();
        let toast = $("#toast");
        toast.show()
        setTimeout(() => toast.hide(), 2000);
    });
});

/**
 * Création d'un pointer
 */
$("#create-pointer-button-form").click(() => {
    const payload = {
        "title": $("#create-name-pointer").val(),
        "description": $("#create-desc-pointer").val(),
        "camera": {
            "position": [
                $("#create-pos-cam-x-pointer").val(),
                $("#create-pos-cam-y-pointer").val(),
                $("#create-pos-cam-z-pointer").val()
            ],
            "target": [
                $("#create-pos-target-x-pointer").val(),
                $("#create-pos-target-y-pointer").val(),
                $("#create-pos-target-z-pointer").val()
            ]
        },
        "position": {
            "x": $("#create-pos-x-pointer").val(),
            "y": $("#create-pos-y-pointer").val(),
            "z": $("#create-pos-z-pointer").val()
        }
    };

    const settings = {
        "async": true,
        "crossDomain": false,
        "url": `${BASE_URL}/pointer/`,
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify(payload)
    };

    $.ajax(settings).done(response => {
        console.log(response);
        loadPointers();
        let toast = $("#toast");
        toast.show()
        setTimeout(() => toast.hide(), 2000);
    });
});

/**
 * Charge les objets du silo
 */
function getObjects() {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `${BASE_URL}/silo`,
        "method": "GET",
        "headers": {},
    };

    $.ajax(settings).done(response => {
        let data = JSON.parse(response);
        console.log(data);
        $("#silo-object-container").empty();
        data.forEach(element => {
            $("#silo-object-container").append(
                `<a data-id="${element._id}" href="#" class="list-group-item list-group-item-action">${element.name}</a>`
            );
            if (element._id === "6218fea0ef00f02e13c7a6de") {
                currentObj = element;
                $("#object-info img").attr("src", element.picture);
                $("#object-info h5").text(element.name);
                $("#object-info .card-text").text(element.description);
            }
        });
        $('#silo-object-container a[data-id="6218fea0ef00f02e13c7a6de"]').addClass("active");
        loadPointers();
    });
}

/**
 * Charge les pointers d'un objet
 */
function loadPointers() {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `${BASE_URL}/pointer`,
        "method": "GET",
        "headers": {},
    };

    $.ajax(settings).done(response => {
        let data = JSON.parse(response);
        console.log(data);
        pointers = data;
        $("#pointers-container").empty();
        data.forEach(element => {
            let html = "<a href=\"#\" class=\"list-group-item list-group-item-action\" aria-current=\"true\" " +
                "          data-bs-toggle=\"modal\" data-bs-target=\"#pointerModal\">\n" +
                "                    <meta name='pointer-id' content='" + element.id + "'>" +
                "                    <div class=\"d-flex w-100 justify-content-between\">\n" +
                "                        <h5 class=\"mb-1\">" + element.title + "</h5>\n" +
                "                    </div>\n" +
                "                    <p class=\"mb-1\">" + element.description + "</p>\n" +
                "                    <small></small>\n" +
                "                </a>"
            $("#pointers-container").append(html);
        });
        $("#pointers-container .list-group-item").click(e => {
            let currentPointer = undefined;
            let selectedPointerId = $(e.currentTarget).find("meta[name='pointer-id']").attr("content");
            pointers.forEach(p => {
                if (p.id === selectedPointerId) {
                    currentPointer = p;
                }
            });
            console.log(currentPointer);
            $("#id-pointer").attr("value", currentPointer.id);
            $("#name-pointer").attr("value", currentPointer.title);
            $("#desc-pointer").attr("value", currentPointer.description);
            $("#pos-x-pointer").attr("value", currentPointer.position.x);
            $("#pos-y-pointer").attr("value", currentPointer.position.y);
            $("#pos-z-pointer").attr("value", currentPointer.position.z);
            $("#pos-cam-x-pointer").attr("value", currentPointer.camera.position[0]);
            $("#pos-cam-y-pointer").attr("value", currentPointer.camera.position[1]);
            $("#pos-cam-z-pointer").attr("value", currentPointer.camera.position[2]);
            $("#pos-target-x-pointer").attr("value", currentPointer.camera.target[0]);
            $("#pos-target-y-pointer").attr("value", currentPointer.camera.target[1]);
            $("#pos-target-z-pointer").attr("value", currentPointer.camera.target[2]);
        });
    });
}
