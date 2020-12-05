const REFRESH_INTERVAL = 60 * 1000 // 1 minute

function outputValueHider(output_element_ID, output_PWM_ID){
 $(output_element_ID).on('change', function() {
   let PWM = $(this).val().split("|")[1]
   if (PWM == 0){
     $(output_PWM_ID).fadeOut()
   } else {
     $(output_PWM_ID).fadeIn()
   }
 }).trigger("change")
}

function outputHider(output_element_ID, element_to_hide, element_to_show, trigger){
  $(output_element_ID).on('change', function() {
    let event = $(this).val().split("|")[1]
    if (event == 'Warn'){
      $(element_to_hide).fadeOut({done: () => {
        $(element_to_show).fadeIn()
      }})
    } else {$(element_to_show).fadeOut({done: () => {
      $(element_to_hide).fadeIn()
    }})
    }
  })
  if (trigger) {
    $(output_element_ID).trigger("change")
  }
 }

//AJAX for timeForm (addTimeEvent)
function timeForm() {
  $('#TimeForm').submit(function(e) {
    e.preventDefault();
    $('#TimeSubmitButton').attr("disabled", true);
    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addTimeEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#newScheduleModal').html(res.addEvent)  
        $('#manual').html(res.manual);    
        $('#TimeSubmitButton').attr("disabled", false);            
        // alert(res.msg);
        $('#newScheduleModal').modal('hide');
        $('#TimeForm').trigger("reset");
      },
      error: function(res) {
        $('#TimeSubmitButton').attr("disabled", false);
        alert(res.responseText);
      }
    });
  });
}

//AJAX for sensorForm (addSensorEvent)
function sensorForm() {
  $('#SensorForm').submit(function(e) {
    e.preventDefault();
    $('#SensorSubmitButton').attr("disabled", true);
    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addSensorEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#newScheduleModal').html(res.addEvent)
        $('#manual').html(res.manual);
        $('#SensorSubmitButton').attr("disabled", false);
        // alert(res.msg);
        $('#newScheduleModal').modal('hide');
        $('#SensorForm').trigger("reset");
      },
      error: function(res) {
        $('#SensorSubmitButton').attr("disabled", false);
        alert(res.responseText);
      }
    });
  });
}

//AJAX for periodicForm (addPeriodicEvent)
function periodicForm() {
  $('#PeriodicForm').submit(function(e) {
    e.preventDefault();
    $('#PeriodicSubmitButton').attr("disabled", true);
    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addPeriodicEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#newScheduleModal').html(res.addEvent)
        $('#manual').html(res.manual);
        $('#PeriodicSubmitButton').attr("disabled", false);             
        // alert(res.msg);
        $('#newScheduleModal').modal('hide');
        $('#PeriodicForm').trigger("reset");
      },
      error: function(res) {
        $('#PeriodicSubmitButton').attr("disabled", false);
        alert(res.responseText);
      }
    });
  });
}

//AJAX for updateForm (updateSchedule)
//This function is called in updateEventMeta.pug due to some weirdness
//in element generation. As this form is generated and not present otherwise,
//this function is best called when the form is actually created.
function updateForm() {
  $('#UpdateForm').submit(function(e) {
    e.preventDefault();
    $('#UpdateDeleteButton').attr("disabled", true);
    $('#UpdateUpdateButton').attr("disabled", true);
    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/updateSchedule',
      data: data,
      cache: false,
      success: function(res) {
        $('#newScheduleModal').html(res.addEvent)
        $('#schedule').html(res.schedules);
        $('#manual').html(res.manual);
        $('#UpdateDeleteButton').attr("disabled", false);
        $('#UpdateUpdateButton').attr("disabled", false);           
        // alert(res.msg);
        $('#updateScheduleModal').modal('hide');
        $('#UpdateForm').trigger("reset");
      },
      error: function(res) {
        $('#UpdateDeleteButton').attr("disabled", false);
        $('#UpdateUpdateButton').attr("disabled", false);
        alert("Error on manual change.");
      }
    });
  });
}

//AJAX and stuff for Manual Control
function manualForm() {

  $('.manualCheckbox').each(function()
  {
    let id = (this.id).split('|')[1]
    let manualOutputDiv = '#manualOutputDiv' + id
    let manualOutputSwitch = '#manualOutputSwitch' + id
    let manualOutputValue = '#manualOutputValue_' + id
    if(!$(this).is(':checked')) {              
      $(manualOutputDiv + " *").hide()
    }
    $(this).on('change', function() {
      if(this.checked) {
        $(manualOutputDiv + " *").fadeIn()
      } else {
        $(manualOutputDiv + " *").fadeOut()
      }
    })
    $(manualOutputValue).on('change', function() {    
      if(!$(manualOutputSwitch).prop('checked')){
        $(manualOutputSwitch).prop('checked', true).trigger('change')
      }
    })     
  })  

  $('#ManualForm').submit(function(e) {
    e.preventDefault();
    $('#ManualSubmitButton').attr("disabled", true);
    var form = $(this);
    var data = form.serializeArray();
  
    $.ajax({
      type: 'POST',
      url: '/addManualEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#newScheduleModal').html(res.addEvent)
        $('#schedule').html(res.schedules);
        $('#manual').html(res.manual);
        $('#ManualSubmitButton').attr("disabled", false);         
        // alert(res.msg);
      },
      error: function(res) {
        $('#ManualSubmitButton').attr("disabled", false);
        alert("Error on manual change.");
      }
    });
  });
}

function manualFormOnChange(){
  $('#manual').find("select").on('change', function(e) {
    let outputID = $(this).attr('id').split('_')[1]
    let manualOutputSwitch = '#manualOutputSwitch' + outputID
    e.preventDefault();
    $('#ManualSubmitButton').attr("disabled", true);
    var form = $('#ManualForm');
    var data = form.serializeArray();
    //If output is manually on, send POST
    if($(manualOutputSwitch).prop('checked') == true){
      $.ajax({
        type: 'POST',
        url: '/addManualEvent',
        data: data,
        cache: false,
        success: function(res) {
          $('#newScheduleModal').html(res.addEvent)
          $('#schedule').html(res.schedules);
          // $('#manual').html(res.manual);
          $('#ManualSubmitButton').attr("disabled", false);         
          // alert(res.msg);
        },
        error: function(res) {
          $('#ManualSubmitButton').attr("disabled", false);
          alert("Error on manual change.");
        }
      });
    }
  });

  $('#manual').find(":checkbox").on('change', function(e) {
    e.preventDefault();
    $('#ManualSubmitButton').attr("disabled", true);
    var form = $('#ManualForm');
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addManualEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#newScheduleModal').html(res.addEvent)
        $('#schedule').html(res.schedules);
        // $('#manual').html(res.manual);
        $('#ManualSubmitButton').attr("disabled", false);         
        // alert(res.msg);
      },
      error: function(res) {
        $('#ManualSubmitButton').attr("disabled", false);
        alert("Error on manual change.");
      }
    });
  });
}

//AJAX for generating schedule update modal
function updateScheduleModal() {
  $('#updateScheduleModal').modal({
    keyboard: true,
    show: false
  }).on('show.bs.modal', function(){
    var data = $(event.target).closest('tr').data('scheduleid');
    var datagram = {};
    datagram.data = data;
    $.ajax({
      type: 'POST',
      url: '/getScheduleData',
      data: datagram,
      cache: false,
      success: function(res) {
        $('#updateScheduleContent').html(res.html);
        $('#UpdateOutputDiv').hide()
        $('#UpdateWarnDiv').hide()
        if(res.defaults.eventName == "Warn"){
          $('#UpdateWarnDiv').show()
        } else {
          $('#UpdateOutputDiv').show()
        }
        $('#updateScheduleContent').collapse('show');
      },
      error: function(res) {
        alert("Server could not be reached.");
      }
    });
  }).on('hidden.bs.modal', function(){
      $('#updateScheduleContent').html("Loading. . .");
      $('#updateScheduleContent').collapse('hide');
  });
};


//Conditions and schedule refresh
function dataRefresh() {
  setInterval(function() {
    let select = document.getElementById("chart_interval")
    let datagram = {interval: select.value}
    $.ajax({
      type: 'POST',
      url: '/api/getEnvironment',
      data: datagram,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#current-conditions').html(res.currentConditions);
        $('#newScheduleModal').html(res.addEvent)
      },
      error: function(res) {
        console.error("Could not contact server to update charts!")
      }
    });
  }, REFRESH_INTERVAL)
};

// Ajax for on change of chart interval
function chartIntervalChange() {
  $('#chart_interval').on('change', function() {
    let select = document.getElementById("chart_interval")
    $('#chart_interval').attr("disabled", true);
    let datagram = {interval: select.value}
    $.ajax({
      type: 'POST',
      url: '/api/getEnvironment',
      data: datagram,
      cache: false,
      success: function(res) {
        $('#chart_interval').attr("disabled", false);
        $('#schedule').html(res.schedules);
        $('#current-conditions').html(res.currentConditions);
        $('#newScheduleModal').html(res.addEvent)
      },
      error: function(res) {
        $('#chart_interval').attr("disabled", false);
        alert("Could not update charts.");
      }
    });
  })
}

function docuReady() {
  dataRefresh()
  updateScheduleModal()
  chartIntervalChange()
  //Prevent accidental form entries
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
}

$(document).ready(docuReady);

function setDelete(){
  $('#UpdateMode').val('Delete');
}

function setUpdate(){    
  $('#UpdateMode').val('Update');
}

function generateChart(sensorID, sensorUnits, data, sensorType){    
  let config = generateChartConfig(sensorUnits, data, sensorType)
  let ctx = document.getElementById(sensorID + '-canvas').getContext("2d");
  window.myLine = new Chart(ctx, config)
}

function generateChartConfig(sensorUnits, data, sensorType){ 
  let config = {
    type: 'line',
    data: {
      datasets: [{
        fill: false,
        label: sensorUnits, 
        data: data,
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-blue'),
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-blue'),
      }]
    },
    options: {
      animation:{
        duration: 0
      },
      legend: {
        display: false
      },
      elements: {
        point: {
          radius: 1
        }
      },
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            fontColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-normal')
          },
          gridLines: {
            drawBorder: false,
            color: getComputedStyle(document.documentElement).getPropertyValue('--website-bg-normal')
          },
          type: "time",
          time: {
            // unit: 'hour',
            tooltipFormat: 'h:mm A'
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-green')
          },
          gridLines: {
            drawBorder: false,
            color: getComputedStyle(document.documentElement).getPropertyValue('--website-bg-normal')
          },
          scaleLabel: {
            fontColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-green'),
            display: true,
            labelString: sensorUnits
          }
        }]
      }
    }
  }
  switch (sensorType) {
    case 'Temperature':
      if (sensorUnits == "°C" || sensorUnits == "C") {
        config.options.scales.yAxes[0].ticks.suggestedMin = 10     
        config.options.scales.yAxes[0].ticks.suggestedMax = 27
      } else if (sensorUnits == "°F" || sensorUnits == "F") {
        config.options.scales.yAxes[0].ticks.suggestedMin = 50     
        config.options.scales.yAxes[0].ticks.suggestedMax = 80
      }
      break;
    case 'Humidity':      
      config.options.scales.yAxes[0].ticks.suggestedMin = 40     
      config.options.scales.yAxes[0].ticks.suggestedMax = 60
      break;
    case 'Pressure':      
      config.options.scales.yAxes[0].ticks.suggestedMin = 99     
      config.options.scales.yAxes[0].ticks.suggestedMax = 102
      break;
    case 'CarbonDioxide':      
      break;
  
    default:
      break;
  }
  return config
}

$(document).on('click', 'a[href^="#"]', function (event) {
  event.preventDefault();

  $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top
  }, 500);
});