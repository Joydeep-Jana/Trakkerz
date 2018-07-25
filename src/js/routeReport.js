w3.includeHTML();
$(document).ready(function(){
    setTimeout(function(){
        // var map = new GMaps({
        //     div: '#map',
        //     lat: 22.5726,
        //     lng: 88.3639
        //   });
        var mapProp= {
            center:new google.maps.LatLng(22,88),
            zoom:11,
        };
        var map=new google.maps.Map(document.getElementById("map"),mapProp);
        map.drawRoute({
                origin: [-12.044012922866312, -77.02470665341184],
                destination: [-12.090814532191756, -77.02271108990476],
                travelMode: 'driving',
                strokeColor: '#131540',
                strokeOpacity: 0.6,
                strokeWeight: 6
              });


    },1000);
    $("#col2").on("click", "#btnSubmit", submited);
})

function submited()
{
    var url="http://Management.trakkerz.com/api/Reports/FetchRouteHistory";
    var date = $("#selFromDate").val();
    var personId = $("#formControlSelectPerson").val();
    var group = $("#formControlSelectGroup").val();
    var params = ["OrganizationId","PersonId", "GroupId", "ActivityDate"];
    var values = [1, 8856, 7598, date];
    var dataString = createJSON(params,values);
    ajaxCall(url, "POST", dataString, "application/json", submitedResponse);
}
function submitedResponse(res)
{
    console.log(res);
    if(res.IsOk)
    {
        var coordinates = res.ResponseObject.CoordinatesList;
        console.log(coordinates.length);
        // map.drawRoute({
        //     origin: [-12.044012922866312, -77.02470665341184],
        //     destination: [-12.090814532191756, -77.02271108990476],
        //     travelMode: 'driving',
        //     strokeColor: '#131540',
        //     strokeOpacity: 0.6,
        //     strokeWeight: 6
        //   });
    }
}
function initMap() {
    
    }
