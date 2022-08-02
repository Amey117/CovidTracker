console.log("Working!!!!!")

$(document).ready()
{  // ready start
 

var retdata=``
var myChart;
var mypiechart;
var mydouchart

function statewise(state)
{
        var arr = [];
        var newarr=[];
        var result;
        var nameArray;
        
        var url = "https://data.covid19india.org/v4/min/data.min.json"
        $.get(url,function(d){
            console.log("data returened by api call",d)
            let display_total =  d[state].total.confirmed;
            let display_recovered =  d[state].total.recovered;
            let display_vac1 =  d[state].total.vaccinated1;
            let display_vac2 =  d[state].total.vaccinated2;
            let display_death = d[state].total.deceased;
            $("#dtotal").html(display_total);
            $("#drecovered").html(display_recovered);
            $("#ddeaths").html(display_death);
            $("#dvac1").html(display_vac1);
            $("#dvac2").html(display_vac2);

            var target_state=  d[state].districts
            console.log("check point state data ",target_state)
            var obj = target_state
            //console.log("obj",obj)

            for (var key in target_state) {
               
                if(key[0]!='[')
                { 
                console.log("obj->key",obj[key].total.confirmed)
                var entry = `<tr>
                <td>${key}</td> 
                <td>${obj[key].total.confirmed}</td>        
                </tr> <br>`
                console.log("key ", key)
                $("#tablebody").append(entry)
                var temp = new Object;
                temp.district = key;
                temp.cases = target_state[key].total.confirmed;
                arr.push(temp)
                }
                
            } //end of for loop
        //sorting the array
        arr.sort(function(a,b){
            return (a.cases-b.cases)*-1 })
        //taking top 5 entries only    
        newarr = arr.slice(0,5)
        result = newarr.map(function (el) { return el.district; });
        nameArray = newarr.map(function (el) { return el.cases; });
       
        const data = {
            labels: result,
            datasets: [{
            label: 'COVID 19 CASES',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'red',
            data: nameArray,
              }]
        };

        const config = {
            type: 'line',
            data,
            options:{
                scales:{
                    y:{
                       beginAtZero: true 
                    }
                },
                legend:{
                    labels:{
                        fontColor:"green"
                    }
                }
            }
        }
        const ctx = document.getElementById('myc').getContext("2d");
        myChart = new Chart(ctx,config);
        console.log("population of maharashtra is ", d[state].meta.population)
        console.log("total people with 1st dose of vaccine",d[state].total.vaccinated1)
        console.log("total people with 2nd dose of vaccine",d[state].total.vaccinated2)
        var vaccine = [d[state].total.vaccinated1,d[state].total.vaccinated2]
        //pie chart for vaccination details
        const data_pie = {
            labels: ["Partial Vaccinated","Fully Vaccinated"],
            datasets: [{
            label: 'COVID 19 Vaccine',
            backgroundColor: ['rgb(54, 162, 235)',' yellow'],
            hoverOffset: 4,
            data: [ display_vac1 , display_vac2 ]
              }]
            };

          const config_pie = {
             type: 'pie',
             data:data_pie,
             options:{
                 legend:{
                     labels:{
                         color:'blue',
                         font:{
                             size:20
                         }
                     }
                 }
             }
            };
        const ctx_pie = document.getElementById("myc1_pie").getContext("2d")
        mypiechart = new Chart(ctx_pie,config_pie)
        hospital(state_name)
        })//end of get
}//end of function statewise    

function vaccine(pincode,date)   
{
  var url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${date}`
  $.get(url,function(data){
      console.log("inside vaccination center")
      console.log(data)
      data = data.centers;
      for(let i=0;i<data.length;i++)
      {
          console.log("value of i is ",data[i].name)
          var target = $("#vac_parent");
          var app_text = `<div class="vac_card">
          <div>Center id : ${data[i].center_id}</div>
          <div>Center name : ${data[i].name}</div>
          <div>${ data[i].address} &nbsp; ${data[i].district_name}  &nbsp; ${data[i].state_name}</div>
          </div>`
          target.append(app_text)
      }
      console.log("finish appending")
  })
    
}//end of world vaccine function

function hospital(state)
{
    //doughnut chart for each state
    var rbeds,ubeds;
    var url = "https://api.rootnet.in/covid19-in/hospitals/beds";
    $.get(url,function(h_data){
        console.log("hospital bed info")
        var allstates = h_data.data.regional;
        console.log("all states",allstates)
        for(var i=0;i<allstates.length;i++)
        {
            if(allstates[i].state===state)
             {
                console.log(allstates[i].state,state);
                rbeds = allstates[i].ruralBeds;
                ubeds=allstates[i].urbanBeds;
                break;
             }
        }
        const data = {
            labels: [
              'RuralBeds',
              'UrbanBeds'
            ],
            datasets: [{
              label: 'Hospital Bed Data',
              data: [rbeds,ubeds],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(255, 180, 86)'
              ],
              hoverOffset: 4
            }]
        };//end of const data
        const config = {
            type: 'doughnut',
            data: data,
        };
        
        const ctx_dou = document.getElementById("myc1_dou").getContext("2d")
        mydouchart = new Chart(ctx_dou,config)
    })
}//end of hospital function

statewise("MH")

    var state_name; 
     document.getElementById("stateopts").addEventListener("submit",function(event){
     console.log("submit btn got clicked")
     var state =  $("#myselect option:selected").val()
     state_name =  $("#myselect option:selected").text()
     console.log(state)
     $("#tablebody").html('')
     statewise(state)
     myChart.destroy();
     mypiechart.destroy();
     mydouchart.destroy();
     event.preventDefault();
     }) //end of event listner

     document.getElementById("vaccination_center").addEventListener("submit",function(event){
        console.log("inside vaccination details")
        console.log("pincode entered is ", $("#pincode").val())
        console.log("date entered is ", $("#vac_date").val())
        var date_recieved = $("#vac_date").val();
        var pincode = $("#pincode").val();
        var newdate;
        newdate = date_recieved.split("-");
        date_recieved = newdate[2]+"-"+newdate[1]+"-"+newdate[0];
        vaccine(pincode,date_recieved)
        event.preventDefault();
     })

}//end of ready     
