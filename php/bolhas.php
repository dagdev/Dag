<?php
 
  //Create a connection to the database
  $mysqli = new mysqli("mysql.hostinger.com.br", "u371072401_dag", "mx1Yx2sx3Qx4lx5", "u371072401_dag");

  if ($mysqli->connect_errno) {
    echo "Falha na conexão com o MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
  }

  //The default result to be output to the browser
  $result = "{'success':false}";
 
  $query = "SELECT id_bolha, nome, descricao, latitude, longitude FROM dag_bolha";

  //Run the query
  $dbresult = $mysqli->query($query);
 
  //Build an array of markers from the result set
  $markers = array();
 
  while($row = $dbresult->fetch_array(MYSQLI_ASSOC)){
 
    $markers[] = array(
      'id_bolha'  => $row['id_bolha'],
      'nome'      => $row['nome'],
      'descricao' => $row['descricao'],
      'latitude'  => $row['latitude'],
      'longitude' => $row['longitude']
    );
  }
 
  //If the query was executed successfully, create a JSON string containing the marker information
  if($dbresult){
    $result = "{'success':true, 'markers':" . json_encode($markers) . "}";        
  }
  else
  {
    $result = "{'success':false}";
  }
 
  //Set these headers to avoid any issues with cross origin resource sharing issues
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type,x-prototype-version,x-requested-with, x-bearer-token');
 
  //Output the result to the browser so that our Ionic application can see the data
  echo($result);
 
?>