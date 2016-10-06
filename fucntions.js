//Clears the table of all currently saved answers
function clearinputs()
{
  document.getElementsByName('tag')[0].value = '';
  document.getElementsByName('velocity')[0].value = '';
  //document.getElementById('model').value = a;
  document.getElementsByName('number')[0].value = '';

}

function cleartable() {
    var table = document.getElementById('anstable');

    if (table.rows.length > 2)
    {
        for(var i = 0; i < (table.rows.length-1); i++)
        {
            table.deleteRow(-1);
        }
    }
    if(!(table.rows.length <= 2))
    {
      cleartable();
    }

}

//Saves the answer to the table along with the other needed information
function saveanswer() {

    saveinsertionloss();

    savepressureddrop();

}

function savepressureddrop()
{
    document.getElementsByName('staticpressuredrop')[0].value
}

function calculatestaticpressuredrop(model, velocity, number)
{
    //Find two surrounding Pressure Drops
    var velocities = surroundingvelocities(model, velocity);
    var surroundnumber = surroundingnumber(model, number);
    var lowerpressuredrops = surroundingpressures(model, velocity, surroundnumber[0]);
    var higherpressuredrops = surroundingpressures(model, velocity, surroundnumber[1]);

    //Interpolate Pressure Drops
    var lowstatpress = interpolate(velocities[0], velocities[1], velocity, lowerpressuredrops[0], lowerpressuredrops[1]);
    var highstatpress = interpolate(velocities[0], velocities[1], velocity, higherpressuredrops[0], higherpressuredrops[1]);
    var statpress = interpolate(velocities[0], velocities[1], velocity, lowstatpress, highstatpress);

    //Round final answer
    statpress = Math.round(statpress * 100) / 100;
    
    //return interpolated pressure drop
    return statpress;
}

function saveinsertionloss()
{
  var table = document.getElementById('anstable');
  var model = document.getElementById('model').value;
  var row = table.insertRow(-1);

  var tag = row.insertCell(0);
  var number = row.insertCell(1);
  var facevel = row.insertCell(2);
  var spd = row.insertCell(3);
  var lossarray = document.getElementsByName('ans')[0].value;
  var partsOfStr = lossarray.split(',');

  tag.innerHTML = document.getElementsByName('tag')[0].value;
  if (model == 'axa' || model == 'axb' || model == 'cnb' || model == 'cnc')
  {
    number.innerHTML = document.getElementById('model').value.toUpperCase()
  }
  else {
    number.innerHTML = document.getElementById('model').value.toUpperCase() + '-' + document.getElementsByName('number')[0].value;
  }

  facevel.innerHTML = document.getElementsByName('velocity')[0].value + ' ' + document.getElementById('velunit').value.toUpperCase();
  spd.innerHTML = document.getElementsByName('staticpressuredrop')[0].value;

  for(var i = 4; i < (4+8); i++)
  {
    row.insertCell(i).innerHTML = partsOfStr[(i-4)];
  }
}

//Convert the velocities from CFM to FPM
function convertvelocity() {
    //Do all the converty things here
    return;
}

//Return the index to the array that is greater than the given value
function getgreaterindex(array, number) {
    //loops through the array
    for (var i = 0; i < array.length; i++) {
        //check to see if the current number is greater than the input number
        if (number <= array[i]) {
            //returns the index value of the next greater value
            return i;
        }
    }

    return NaN;
}

//Return the surrounding velocities in an array
function surroundingvelocities(model, velocity) {
    //Get the index for the higher face velocity
    var index = getgreaterindex(this[model]['facevelocity'], velocity);

    //Check to make sure both indexes are in the array
    if (index == 0) {
        console.log("Index for the face velocity was equal to zero")
        return NaN;
    }

    //Make sure that the index doesn't run off the array
    if (index > this[model]['facevelocity'].length) {
        console.log("Index for the face velocity was greater than the velocity array.")
        return NaN;
    }

    var array = [this[model]['facevelocity'][index - 1], this[model]['facevelocity'][index]];
    return array;
}

//Return the surrounding pressures in an array
function surroundingpressures(model, velocity, number) {
    //Get the index for the higher face velocity
    var index = getgreaterindex(this[model]['facevelocity'], velocity);

    //Check to make sure both indexes are in the array
    if (index == 0) {
        console.log("Index for the static pressure was equal to zero")
        return NaN;
    }

    //Make sure that the index doesn't run off the array
    if (index > this[model]['facevelocity'].length) {
        console.log("Index for the static pressure was greater than the velocity array.")
        return NaN;
    }

    var array = [this[model][String(number)]['staticpressuredrop'][index - 1], this[model][number]['staticpressuredrop'][index]];
    return array;
}

//Return the surrounding model numbers in an array
function surroundingnumber(model, number) {
    //Get the index for the higher model number
    var index = getgreaterindex(this[model]['modlist'], number);

    //Check to make sure both indexes are in the array
    if (index == 0) {
        console.log("Index for the model number was equal to zero")
        return [this[model]['modlist'][index], this[model]['modlist'][index + 1]];
    }

    if (index > this[model]['modlist'].length) {
        console.log("Index for the model number was greater than the velocity array.")
        return NaN;
    }

    var array = [this[model]['modlist'][index - 1], this[model]['modlist'][index]];
    return array;


}

//Interpolates the values that are given
function interpolate(modelone, modeltwo, modelthree, velone, veltwo) {
    //check to make sure all inputs are numbers
    if (isNaN(modelone) || isNaN(modeltwo) || isNaN(modelthree) || isNaN(velone) || isNaN(veltwo)) {
        //output an error to the console log
        console.log("One or more of the inputs is NaN. Be better about your inputs.");
        console.log(modelone + " ," + modeltwo + " ," + modelthree + " ," + velone + " ," + veltwo)
            //return an error to the rest of the program
        return NaN;
    }
    //return the interpolated value to the program
    return velone + (veltwo - velone) * ((modelthree - modelone) / (modeltwo - modelone));
}

function openNav()
{
  document.getElementById('myinputs').style.width = "250px";
}

function closeNav()
{
  document.getElementById('myinputs').style.width = "0";
}
