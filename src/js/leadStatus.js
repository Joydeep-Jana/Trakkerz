w3.includeHTML();
$(document).ready(function(){
    gatherGroups();
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
    $("#col2").on("click", "#btnSubmit", submited);

});
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
function submited()
{
    var url="http://Management.trakkerz.com/api/Reports/NewLeads";
    var fromDate = $("#selFromDate").val();
    var toDate = $("#selToDate").val();
    var personId = $("#formControlSelectPerson").val();
    var group = $("#formControlSelectGroup").val();
    if(fromDate == "")
    {
        alert("Please select a date");
        return;
    }
    if(toDate == "")
    {
        alert("Please select a date");
        return;
    }
    if(toDate < fromDate)
    {
        alert("From date should be before To date!");
        return false;
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
    
    var params = ["FromDate","Todate", "GroupId", "PersonId"];
    // var values = ['2018-01-01', "2018-05-01", 7598, 8856];
    var values = [fromDate, toDate, group, personId];
    var dataString = createJSON(params,values);
    ajaxCall(url, "POST", dataString, "application/json", submitedResponse);
}

function submitedResponse(res)
{
    console.log(res);
    if(res.IsOk)
    {
        var responseData = res.ResponseObject;
        var tableData = new Array();
        for(var index=0; index<responseData.length; index++)
        {
            var rawData = responseData[index];
            var row = new Array();
            row.push(rawData.LeadName);
            row.push(rawData.SchoolContactPerson);
            row.push(rawData.ContactNumber);
            row.push(rawData.State);
            row.push(rawData.City);
            row.push(rawData.LeadCreator);
            var status = rawData.SPENDStatus;
            switch(status)
            {
                case 'D':
                    status = "Done";
                    break;
                case 'N':
                    status = "Not Done";
                    break;
                case 'S':
                    status = "Suspecting";
                    break;
                case 'P':
                    status = "Prospecting";
                    break;
                case 'E':
                    status = "Expecting";
                    break;
            }
            row.push(status);
            row.push(rawData.LastVisited);
            row.push(rawData.Remarks);
            tableData.push(row);    
        }
        console.log(tableData);
        var tableHtml = '<table id="leadStatusTable" class="table table-striped table-bordered">'+
        '<thead>'+
            '<tr>'+
                '<th>School Name</th>'+
                '<th>Contact Person</th>'+
                '<th>contact no</th>'+
                '<th>state</th>'+
                '<th>city</th>'+
                '<th>Executive</th>'+
                '<th>Lead Status</th>'+
                '<th>Last Visit Date</th>'+
                '<th>Feedback</th>'+
            '</tr>'+
        '</thead>'+
        '<tbody>'+
        '</tbody>'+
    '</table>';
        $(".tableForLead").html(tableHtml);
        $("#leadStatusTable").dataTable({
            destroy:true,
            data:tableData
        });
    }
    else{
        alert(res.Message);
    }
}