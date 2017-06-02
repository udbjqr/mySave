/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

/*
 * Assignment
 */
var KisBpmAssignmentCtrl = [ '$scope', '$modal', function($scope, $modal) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/assignment-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
}];

var KisBpmAssignmentPopupCtrl = [ '$scope','$translate','$http', function($scope, $translate, $http) {
    	

    // Put json representing assignment on scope
    if ($scope.property.value !== undefined && $scope.property.value !== null
        && $scope.property.value.assignment !== undefined
        && $scope.property.value.assignment !== null) 
    {
        $scope.assignment = $scope.property.value.assignment;
    } else {
        $scope.assignment = {};
    }

    if ($scope.assignment.candidateUsers == undefined || $scope.assignment.candidateUsers.length == 0)
    {
    	$scope.assignment.candidateUsers = [{value: ''}];
    }else{
         $scope.valueListName = [];
         $scope.valueListValue = [];
        console.log($scope.assignment.candidateUsers);
        $http({method: 'POST', url: ACTIVITI.CONFIG.contextRoot + '/processManger.do?paramMap={"controlType":"loadObjectByExpression","name_expression":"'+ $scope.assignment.candidateUsers +'"}'}).
        success(function (data) {
            if(data.values){
                for(var i=0;i < data.values.jsonList.length;i++){
                    $scope.valueListName.push(data.values.jsonList[i].name);
                    $scope.valueListValue.push(data.values.jsonList[i].id);
                }
            }
        }).
        error(function (data) {
            console.log(data);
        });
    }
    
	//  $http({method: 'POST', url: ACTIVITI.CONFIG.contextRoot + '/role.do?paramMap={"controlType":"query"}'}).
    //     success(function (data) {
    //          $scope.thisselect=data.values;
    //  }).
    //   error(function (data) {
    //     console.log(data);
    //  });
    $scope.showlist = "";
    $scope.showlistul = "";
	 $http({method: 'POST', url: ACTIVITI.CONFIG.contextRoot + '/department.do?paramMap={"controlType":"getSingleFloorByTree","parent_id":"0"}'}).
        success(function (data) {
            if(data.values){
                $scope.thatselect =data.values;
                $scope.thatselect.thistype = "D";
                // var thisdata = data.values;
                // for(var i =0;i<thisdata.child.length;i++){
                //     if(thisdata.child[i].type == "dept"){
                //         thisdata.child[i].id = "D" + thisdata.child[i].id;
                //     }
                // }
                // console.log($scope.thatselect);
            }
            //  $scope.moduleLies=data.values;
     }).
      error(function (data) {
        console.log(data);
     });


        //寻找第二层~
     $scope.getlist = function(id,type){
         /* 判断是否收起 */
         if(id == $scope.showlist){
             $scope.showlist = "";
         }else{
            if(type == "role"){
                var data = '{"controlType": "getUserByDeptAndrole","dept_id": '+ $scope.uid.id +',"role_id": '+id+'}';
                $scope.GetNext(data);
            }else if(type == "dept"){
                var data = '{"controlType": "getSingleFloorByTree","parent_id": '+id+'}';
                $scope.GetNext(data);
            }
            $scope.showlist = id;
         }
     };

     $scope.GetNext = function(date,id){
         $http({method: 'POST', url: ACTIVITI.CONFIG.contextRoot + '/department.do?paramMap=' + date}).
        success(function (data) {
            if(data.values&&data.values.child){
                 for(var i=0;i<data.values.child.length;i++){
                    data.values.child[i].showhide = false;
                }
                $scope.uid = data.values;
                $scope.ctrm = $scope.uid.child;
                console.log($scope.ctrm);
            }else{
                $scope.uid = "";
            }
                        
        }).
        error(function (data) {
            console.log(data);
        });
     }

     

//寻找第N层~
     $scope.getlistul = function(id,type,item){
         console.log(id);
         item.showhide = !item.showhide;
          $scope.showlistul = id;
          if(type == "role"){
                var data = '{"controlType": "getUserByDeptAndrole","dept_id": '+ $scope.uid.id +',"role_id": '+id+'}';
                $scope.GetHttp(data,id,item);
            }else if(type == "dept"){
                var data ='{"controlType": "getSingleFloorByTree","parent_id": '+id+'}';
                $scope.GetHttp(data,id,item);
            }
         
     };

     $scope.GetHttp = function(date,id,item){
         $http({method: 'POST', url: ACTIVITI.CONFIG.contextRoot + '/department.do?paramMap=' + date}).
        success(function (data) {
             if(data.values){
                 console.log($scope.uid.child);
                //  for(var i = 0;i< $scope.ctrm.length;i++){
                //      if($scope.uid.child[i].id == id){
                //          $scope.uid.child[i].child = [];
                //          $scope.uid.child[i].child = data.values.child;
                //          console.log($scope.uid.child[i]);
                //      }
                //  }
                item.child = data.values.child;
               
            }
                        
        }).
        error(function (data) {
            console.log(data);
        });
     }
   


     /* 点击显示下一个并储存数据 */
     $scope.setlistvalue = function(name,id,type){
         /* 判断是否有重复 */
         for(let u=0;u in $scope.valueListName;u++){
             if($scope.valueListName[u]==name){
                 return false;
             }
         }
         /* 给id假如前缀 */
         if(type === "D"){
            $scope.valueListName.push(name);
            $scope.valueListValue.push(type+id);
         }else if(type == "role"){
             $scope.valueListName.push($scope.uid.name + name);
             $scope.valueListValue.push("SD" + $scope.uid.id + "R"+id);
         }else if(type == "dept"){
             $scope.valueListName.push($scope.uid.name + "-" + name);
             $scope.valueListValue.push("D"+id);
         }else if(type == "user"){
             $scope.valueListName.push(name);
             $scope.valueListValue.push("E"+id);
         }
        
         console.log($scope.valueListName,$scope.valueListValue);
     }

    // Click handler for + button after enum value
    var userValueIndex = 1;
    $scope.addCandidateUserValue = function(index) {
        $scope.assignment.candidateUsers.splice(index + 1, 0, {value: 'value ' + userValueIndex++});
    };

    // Click handler for - button after enum value
    $scope.removeCandidateUserValue = function(index) {
        $scope.assignment.candidateUsers.splice(index, 1);
    };
    
    if ($scope.assignment.candidateGroups == undefined || $scope.assignment.candidateGroups.length == 0)
    {
    	$scope.assignment.candidateGroups = [{value: ''}];
    }
    
    var groupValueIndex = 1;
    $scope.addCandidateGroupValue = function(index) {
        $scope.assignment.candidateGroups.splice(index + 1, 0, {value: 'value ' + groupValueIndex++});
    };

    // Click handler for - button after enum value
    $scope.removeCandidateGroupValue = function(index) {
        $scope.assignment.candidateGroups.splice(index, 1);
    };

    $scope.save = function() {

        $scope.property.value = {};
        handleAssignmentInput($scope);
        $scope.property.value.assignment = $scope.assignment;
        console.log($scope.property);
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    // Close button handler
    $scope.close = function() {
    	handleAssignmentInput($scope);
    	$scope.property.mode = 'read';
    	$scope.$hide();
    };
    
    var handleAssignmentInput = function($scope) {
    	if ($scope.valueListValue)
    	{
	    	var emptyUsers = true;
	    	var toRemoveIndexes = [];
            $scope.assignment.candidateUsers = "USER" + $scope.valueListValue.join("_");
	        for (var i = 0; i < $scope.assignment.candidateUsers.length; i++)
	        {
	        	if ($scope.assignment.candidateUsers[i].value != '')
	        	{
	        		emptyUsers = false;
	        	}
	        	else
	        	{
	        		toRemoveIndexes[toRemoveIndexes.length] = i;
	        	}
	        }
	        
	        for (var i = 0; i < toRemoveIndexes.length; i++)
	        {
	        	$scope.assignment.candidateUsers.splice(toRemoveIndexes[i], 1);
	        }
	        
	        if (emptyUsers)
	        {
	        	$scope.assignment.candidateUsers = undefined;
	        }
    	}
        
    	if ($scope.assignment.candidateGroups)
    	{
	        var emptyGroups = true;
	        var toRemoveIndexes = [];
	        for (var i = 0; i < $scope.assignment.candidateGroups.length; i++)
	        {
	        	if ($scope.assignment.candidateGroups[i].value != '')
	        	{
	        		emptyGroups = false;
	        	}
	        	else
	        	{
	        		toRemoveIndexes[toRemoveIndexes.length] = i;
	        	}
	        }
	        
	        for (var i = 0; i < toRemoveIndexes.length; i++)
	        {
	        	$scope.assignment.candidateGroups.splice(toRemoveIndexes[i], 1);
	        }
	        
	        if (emptyGroups)
	        {
	        	$scope.assignment.candidateGroups = undefined;
	        }
    	}
    };
}];

