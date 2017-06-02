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
 * Condition expression
 */

var FormkeyPropertyCtrl = [ '$scope', '$modal', function($scope, $modal) {

    var opts = {
        template:  'editor-app/configuration/properties/formkey.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
}];



var FormkeyPropertyPopupCtrl = [ '$scope', '$translate','$http', function($scope, $translate, $http) {
    
    // Put json representing condition on scope
    if ($scope.property.value !== undefined && $scope.property.value !== null) {

        $scope.conditionExpression = {value: $scope.property.value};
        
    } else {
        $scope.conditionExpression = {value: ''};
    }
    
    $scope.operation=[];
    $http({method: 'POST', url: ACTIVITI.CONFIG.contextRoot + '/module.do?paramMap={"controlType":"query"}'}).
                    success(function (data) {
                       $scope.moduleLies=data.values;
                    }).
                    error(function (data) {
                      console.log(data);
                    });
    $scope.moduleLiesclick = function(id,name){
        $http({method: 'POST', url: ACTIVITI.CONFIG.contextRoot + '/module.do?paramMap={"controlType":"queryHandelsByModuleId","module_id":'+id+'}'}).
                    success(function (data) {
                       $scope.operation=data.values;
                    }).
                    error(function (data) {
                      console.log(data);
                    });
        $scope.module_id=id;
        $scope.module_name=name;
    }
	
    
    

    $scope.save = function() {
        for(var i in $scope.operation){
            if($scope.operation[i].handle_id == $scope.handle_id){
                $scope.handle_name = $scope.operation[i].handle_name
            }
        }
        $scope.module_name = $scope.handle_name + ":" + $scope.module_name;
        $scope.property.value="module:"+$scope.module_id+"&handle:"+$scope.handle_id;
        $scope.property.Remarks=$scope.module_name+$scope.handel_name;
        console.log($scope.property);
        $scope.updatePropertyInModel($scope.property);
        for( var i in $scope.editor.getCanvas().getChildNodes(true)){
            if($scope.editor.getCanvas().getChildNodes(true)[i].id == $scope.previousSelectedShape.id){
                $scope.property = $scope.editor.getCanvas().getChildNodes(true)[i].properties
                
            }
        }
        //console.log($scope.selectedItem.properties);
        // console.log($scope.editor.getCanvas().getChildNodes(true),$scope.previousSelectedShape.id);
        $scope.myUpdatePropertyInModel("oryx-name",$scope.module_name,$scope.previousSelectedShape.id)
        $scope.myUpdatePropertyInModel("oryx-documentation",$scope.handle_name,$scope.previousSelectedShape.id)

        var shape = $scope.selectedShape;
        // $scope.editor.handleEvents({type:ORYX.CONFIG.EVENT_SELECTION_CHANGED, elements:[$scope.editor.getCanvas()]})
        $scope.editor.handleEvents({type:ORYX.CONFIG.EVENT_SELECTION_CHANGED, elements:[shape],forceSelectionRefresh:true})
        $scope.close();//
    };

    // Close button handler
    $scope.close = function() {
    	$scope.property.mode = 'read';
    	$scope.$hide();
    };
}];