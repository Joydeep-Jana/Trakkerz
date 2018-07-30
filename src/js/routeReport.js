w3.includeHTML();
var mainMap;
var directionsService;
var directionsDisplay;
$(document).ready(function(){
    gatherGroups();
    setTimeout(function(){
        var canvas = document.getElementById("map");
        var kolkata = new google.maps.LatLng(22.5726, 88.3639);
        var delhi = new google.maps.LatLng(28.7041, 77.1025);
        var bengalore = new google.maps.LatLng(12.9716, 77.5946);
        var mapProp= {
            center:kolkata,
            zoom:5
        };
        mainMap=new google.maps.Map(canvas,mapProp);
        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer(); 
        directionsDisplay.setMap(mainMap); 
    },1000);
    $("#col2").on("click", "#btnSubmit", submited);
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
    
});

function submited()
{
    var url="http://Management.trakkerz.com/api/Reports/FetchRouteHistory";
    var date = $("#selFromDate").val();
    var personId = $("#formControlSelectPerson").val();
    var group = $("#formControlSelectGroup").val();
    if(date == "")
    {
        alert("Please select a date");
        return;
    }
    if(group == 0)
    {
        alert("Please select a group");
        return;
    }
    if(personId == 0)
    {
        alert("Please select a person");
        return;
    }
    
    var params = ["OrganizationId","PersonId", "GroupId", "ActivityDate"];
    // var values = [1, 8856, 7598, date];
    var values = [1, personId, group, date];
    var dataString = createJSON(params,values);
    console.log(dataString);
    ajaxCall(url, "POST", dataString, "application/json", submitedResponse);
}

function submitedResponse(res)
{
    console.log(res);
    if(res.IsOk)
    {
        var routeCoordinates = res.ResponseObject.CoordinatesList;
        var leads = res.ResponseObject.LeadList;
        console.log(routeCoordinates[0].Latitude);
        mainMap.setZoom(15);
        mainMap.setCenter({lat:routeCoordinates[0].Latitude,lng:routeCoordinates[0].Longitude});
        for(var index=0; index<leads.length; index++)
        {
            addMarker({
                target:mainMap,
                coordinates:{lat:leads[index].Latitude,lng:leads[index].Longitude},
                info:leads[index].LeadName,
                icon:"./src/img/map-marker-2-24.ico"
            });
        }
        var wayPoints = new Array()
        for(var index=0; index<routeCoordinates.length-1; index++)
        {
            var point = {lat:routeCoordinates[index].Latitude, lng:routeCoordinates[index].Longitude};
            var wayPoint = {location:point, stopover:false};
            wayPoints.push(point);
        }
        var pathDetails = {path:wayPoints};
        drawRoute(pathDetails);
    }
    else{
        alert(res.Message);
    }
}

function gatherGroups()
{
    var url = "http://trakkerz.trakkerz.com/api/Groups/GetGroupsByOrganizationId";
    var dataString = {"OrganizationId":1};
    dataString = JSON.stringify(dataString);
    ajaxCall(url, "POST", dataString, "application/json", function(res)
    {
        var data = res.ResponseObject;
        html = "<option value=0 >Select Group</option>";
        for(var index=0; index<data.length; index++)
        {
            var name = data[index].GroupName;
            if(name.length>27)
            {
                name = name.substring(0, 27) + "...";
            }
            html += "<option value='" + data[index].GroupId + "'>" + name + "</option>";
        }
        $("#formControlSelectGroup").html(html);
    });
}
function groupChanged()
{
    if(this.value != "" && this.value != "Select Group")
    {
        var url = "http://trakkerz.trakkerz.com/api/Groups/GetMembersByGroupId";
        var dataString = "{'GroupId':" + this.value + "}";
        ajaxCall(url, "POST", dataString, "application/json", function(res){
            // console.log(res);
            var data = res.ResponseObject;
            var html = "<option>Select Person</option>";
            for(var index=0; index<data.length; index++)
            {
                html += "<option value='" + data[index].PersonId + "'>" + data[index].FirstName + " " + data[index].LastName + "</option>";
            }
            $("#formControlSelectPerson").html(html);
        });
    }
    else
    {
        alert("Please Select a valid Group.");
    }
}









function addMarker(props) 
{
    var marker = new google.maps.Marker({
        position:props.coordinates,
        map:props.target
    });
    if(props.icon)
    {
        marker.setIcon(props.icon);
    }
    var info = new google.maps.InfoWindow({
        content:props.info
    })
    marker.addListener("click", function(){
        info.open(map, marker)
    });
}
function drawRoute(pathDetails)
{
    var path = new google.maps.Polyline({
        path: pathDetails.path,
        geodesic: true,
        strokeColor: '#003300',
        strokeOpacity: 1.0,
        strokeWeight: 4
      });
    path.setMap(mainMap);
}
function createRoute(details)
{
    var start = details.start;
    var end = details.end;
    var request = {
        origin: start,
        destination: end,
        waypoints:details.waypoints,
        travelMode: 'WALKING'
        };
    console.log("req");
    console.log(request);
    directionsService.route(request, function(result, status) {
        console.log(status);
        console.log(result);
    if (status == 'OK') {
        directionsDisplay.setDirections(result);
    }
    });
}
