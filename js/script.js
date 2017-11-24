$(function () {

    getIdFromYoutubeURL = function (url) {
        if (url) {

            video_id = url.split('v=')[1];

            if (video_id) {
                var ampersandPosition = video_id.indexOf('&');

                if (ampersandPosition != -1) {

                    video_id = video_id.substring(0, ampersandPosition);

                }
            }

            return video_id;
        }
    }

    var $template = $(
        '<div class="input-group">' +
        '<input type="text" class="form-control" placeholder="Текст причины"> ' +
        '<span class="input-group-btn" no-padding> ' +
        '<button class="btn btn-default" type="button"><i class="fa fa-trash"></i> </button> ' +
        '</span><br>' +
        '</div>');
    $template.find(".btn").eq(0).on("click", function () {
        $(this).closest(".input-group").remove();
    });

    $("#add-cause").on("click", function () {
        $("#cause").append($template.clone(true));
    });

    $("#result").on("click", function () {

        var cause = [];

        $.each($("#cause").find("input[type=text]"), function (i, obj) {
            cause.push($(obj).val());
        });

        var result = {
            name: $("#name").val(),
            title: $("#title").val(),
            subtitle: $("#sub-title").val(),
            product: $("#product").val(),
            img1: $("#img-1").val(),
            img2: $("#img-2").val(),
            desc: $("#text").val(),
            youtube: getIdFromYoutubeURL($("#youtube").val()),
            cause: cause
        };
        displaySinner();
        setTimeout(function () {
            downloadObjectAsJson(result, "landing")
        }, 2000);
    });
    function downloadObjectAsJson(exportObj, exportName) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function displaySinner() {
        $(".spinner").fadeIn();
        setTimeout(function () {
            $(".spinner").fadeOut();
        }, 2000)
    }

    function onChange(event, callback) {
        var reader = new FileReader();
        reader.onload = callback;
        reader.readAsText(event.target.files[0]);

    }

    function clearFileInputField(Id) {
        $("#" + Id).prop('value', null);
    }

    function loadFromJs(event) {

        clearFileInputField("downloaded");

        try {
            var obj = JSON.parse(event.target.result);
        } catch (err) {
            toastr.info("Вы выбрали не правильный файл", "выберите json файл")
            return
        }
        displaySinner();
        setTimeout(function () {
            $("#name").val(obj.name);
            $("#title").val(obj.title);
            $("#sub-title").val(obj.subtitle);
            $("#product").val(obj.product);
            $("#img-1").val(obj.img1);
            $("#img-2").val(obj.img2);
            $("#text").val(obj.desc);
            $("#youtube").val("https://www.youtube.com/watch?v=" + obj.youtube);

            $("#cause").html("");

            for (var i = 0; i < obj.cause.length; i++) {
                var $cause = $template.clone(true);
                $cause.find("input").val(obj.cause[i]);
                $("#cause").append($cause);
            }
        }, 2000);

    }

    $("#saveSite").on("click", function () {
        if ($("#siteName").val().length == 0) {
            toastr.info("Вы не ввели имя сайта")
        } else {
            obj["sitename"] = $("#siteName").val();
            $(".spinner").fadeIn();
            setTimeout(function () {
                $.post(
                    "/generate.php",
                    obj,
                    function () {
                        $(".spinner").fadeOut();
                        $("#myModal").find('#saveSite').hide();
                        $('#myModal').find('.modal-body input').hide();
                        $('#myModal').find('.modal-body h4').show();
                        $('#myModal').find('.modal-body h4').html("Сайт создан и достпен по адресу <a target='_blank' href='http://blog.com/sites/" + obj["sitename"] + "'>blog.com/sites/" + obj["sitename"] + "</a>")
                    }
                );
            }, 2000);
        }

    });

    function saveFromJs(event) {

        clearFileInputField("saved");

        try {
            window.obj = JSON.parse(event.target.result);
        } catch (err) {
            toastr.info("Вы выбрали не правильный файл", "выберите json файл")
            return

        }
        $("#myModal").find('#saveSite').show();
        $("#myModal").find('.modal-body input').show();
        $("#myModal").find('.modal-body input').html("");
        $('#myModal').find('.modal-body h4').hide();
        $('#myModal').modal('show');

    }


    function onCh1(event) {
        onChange(event, loadFromJs)
    }

    function onCh2(event) {
        onChange(event, saveFromJs)
    }


    document.getElementById('downloaded').addEventListener('change', onCh1);
    document.getElementById('saved').addEventListener('change', onCh2);

});

