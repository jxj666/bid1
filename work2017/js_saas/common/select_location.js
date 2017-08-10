var city = {};
// $(".select-menu select").change(function () {
//     $(this).parent().prev("span").text($(this).find("option:selected").text());
// });
// console.log(data);
data.district_list = data.province_list;
// console.log(data.district_list);

data.district_list.map(function (item) {
    city[item.code] = item.district_list;
});
// console.log(city);

$("#province").html("<option value='-2'>省</option><option value='-1'>全选</option>" + tmpl("template_area", data)).change(function () {
    // console.log($("#province").find("option:selected").text())
    // $("#district").prop("disabled", true).html("<option value='-1'>区</option>").parent().prev("span").text("区");
    if ($("#province").val() == -1 || $("#province").val() == -2) {
        $("#city").prop("disabled", true).html("<option value='-2'>市</option>");
    } else {
        // console.log($("#province").val())
        $("#city").prop("disabled", false).html("<option value='-2'>市</option><option value='-1'>全选</option>" + tmpl("template_area", {district_list: city[$("#province").val()]})).change(
            function () {
                // $("#district").parent().prev("span").text("区");
                if ($("#city").val() == -1) {
                    $("#district").prop("disabled", true).html("<option value='-1'>区</option>");
            } else {
                var country = {};
                city[$("#province").val()].map(function (item) {
                    country[item.code] = item.district_list;
                })
                $("#district").prop("disabled", false).html("<option value='-1'>区</option>" + tmpl("template_area", {district_list: country[$("#city").val()]}))
            }
        })
    }
})