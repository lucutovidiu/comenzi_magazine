<html><head></head><body><div>
<?php
header('Content-Type: Content-Type: text/plain');
//http://localhost/comenzi_magazine/backend/sqltables/sqlrunscript.php
$createTableaAndPopulate = new CreateTableaAndPopulate();

$createTableaAndPopulate->InitializeDB();
$createTableaAndPopulate->populateDBWithFakeInfo();


    class CreateTableaAndPopulate{
    public $servername = 'localhost';
    public $username = 'root';
    public $password = '';
    public $dbname = 'comenzimagazinedb';
    public $conn;

    function getConnection(){
        // Create connection
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
        // Check connection
        if ($this->conn->connect_error) {
            $err='Error: connection failed: ' . $this->conn->connect_error;
            //die($err. '<br>');
            $res = 'response:'.$err;
            echo $res;
        }
    }
    
    function closeConection(){
        $this->conn->close();
    }

    //done
    function dropDatabaseTables(){                       
        $sql='drop table detalii_comanda';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        $sql='drop table comenzi';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        $sql='drop table stare_comenzi';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>'; 
        $sql='drop table articole';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        $sql='drop table utilizatori';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        
    }

    //done
    function populateUsersList(){
        $csv = array_map("str_getcsv", file("./magazine.csv"));
        foreach($csv as $value){
            $nume_utilizator=trim($value[0]);
            $locatie_utilizator=trim($value[1]);
            $sql = "INSERT INTO utilizatori (nume_utilizator, locatie_utilizator,parola_utilizator) VALUES ('$nume_utilizator', '$locatie_utilizator','$nume_utilizator')";
            $result = $this->conn->query($sql);  
            echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        }
    }

    function poulate_really_data(){        
        echo "--------------------------------------------------------------------------------------------";  
        echo "<p> Loading Stare comenzi</p>";
        $sql = "INSERT INTO stare_comenzi (nume_stare) VALUES ('Comanda Nevizualizata')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';           
        $sql = "INSERT INTO stare_comenzi (nume_stare) VALUES ('Comanda Vizualizata')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';            
        $sql = "INSERT INTO stare_comenzi (nume_stare) VALUES ('Comanda Rezolvata')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';            
        $sql = "INSERT INTO stare_comenzi (nume_stare) VALUES ('Comanda Anulata')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';            
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Loading Articole</p>";
        $csv = array_map("str_getcsv", file("./biroticamagazine.csv"));
        foreach($csv as $value){
            $articol=trim($value[0]);
            $randpret = mt_rand(2, 50);
            $randstoc = mt_rand(50, 150);
            $sql = "INSERT INTO articole (nume_articol, cantitate_stoc,pret,status) VALUES ('".$articol."','".$randstoc."', '".$randpret."','active')";
            $result = $this->conn->query($sql);  
            echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        }     
        echo "<p> Finished Loading Articole</p>";
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Loading Comenzi</p>";
        $sql = "INSERT INTO comenzi (id_utilizator, data_comanda,IDStare) VALUES ('2','2019.04.05 12:05','1')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';   
        $sql = "INSERT INTO comenzi (id_utilizator, data_comanda,IDStare) VALUES ('3','2019.02.24 07:35','1')";
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';       
        $sql = "INSERT INTO comenzi (id_utilizator, data_comanda,IDStare) VALUES ('2','2019.02.24 07:55','2')";
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';       
        $sql = "INSERT INTO comenzi (id_utilizator, data_comanda,IDStare) VALUES ('6','2019.03.23 14:15','2')";
        $result = $this->conn->query($sql);   
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';      
        $sql = "INSERT INTO comenzi (id_utilizator, data_comanda,IDStare) VALUES ('16','2019.03.29 16:29','4')";
        $result = $this->conn->query($sql);   
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';      
        echo "<p> Finished Loading Comenzi</p>";
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Loading Detalii Comenzi</p>";
        $sql = "INSERT INTO detalii_comanda (id_comenzi, id_articol,cantitate) VALUES ('1','1','3')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';           
        $sql = "INSERT INTO detalii_comanda (id_comenzi, id_articol,cantitate) VALUES ('1','2','2')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';           
        $sql = "INSERT INTO detalii_comanda (id_comenzi, id_articol,cantitate) VALUES ('2','4','9')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';           
        $sql = "INSERT INTO detalii_comanda (id_comenzi, id_articol,cantitate) VALUES ('3','3','10')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';           
        $sql = "INSERT INTO detalii_comanda (id_comenzi, id_articol,cantitate) VALUES ('3','1','5')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';           
        $sql = "INSERT INTO detalii_comanda (id_comenzi, id_articol,cantitate) VALUES ('3','2','6')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';           
        $sql = "INSERT INTO detalii_comanda (id_comenzi, id_articol,cantitate) VALUES ('4','2','12')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';           
        $sql = "INSERT INTO detalii_comanda (id_comenzi, id_articol,cantitate) VALUES ('5','1','15')";
        $result = $this->conn->query($sql);      
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';           
        echo "<p> Finished Loading Detalii Comenzi</p>";
        echo "--------------------------------------------------------------------------------------------";   
        
      
    }

    //done
    function populateDBWithFakeInfo(){
        $this->getConnection();      
        //populate printer users
        //-------------------------------------------------------------
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Loading Users</p>";
        $sql = "INSERT INTO utilizatori (nume_utilizator, locatie_utilizator,parola_utilizator) VALUES ('admin','sediu', 'admin')";
            $result = $this->conn->query($sql);  
            echo 'result: <'.$result.'> -> '.$sql.' <br/>';        
        $this->populateUsersList();
        echo "<p> Finished Loading Users</p>";
        $this->poulate_really_data();
        echo "--------------------------------------------------------------------------------------------";   
        $this->closeConection();
    }

    function InitializeDB(){
        $this->getConnection();
        
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Drop Existing tables</p>";
        // deleting all existing tables
        $this->dropDatabaseTables();
        echo "<p> Finished Droping Existing tables</p>";
        echo "--------------------------------------------------------------------------------------------";
        //-------------------------------------------------------------
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Creating tables</p>";
        $sql=<<<EOD
        create table utilizatori(
            id                      int auto_increment not null primary key,
            nume_utilizator         varchar(40) unique not null,
            locatie_utilizator      varchar(60) not null,
            parola_utilizator       varchar(100) not null,
            ultima_logare           datetime
        )ENGINE = InnoDB; 
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        echo "--------------------------------------------------------------------------------------------";
        $sql=<<<EOD
        create table stare_comenzi(
            id                      int auto_increment not null primary key,
            nume_stare              varchar(40) unique not null
        )ENGINE = InnoDB; 
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        
        $sql=<<<EOD
        create table articole(
            id                      int auto_increment not null primary key,
            nume_articol            varchar(100) unique not null,
            cantitate_stoc          int not null,
            pret                    float not null,
            status                  varchar(20) not null
        )ENGINE = InnoDB; 
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql=<<<EOD
        create table comenzi(
            nr_comanda              int auto_increment not null primary key,
            id_utilizator           int not null,
            data_comanda            datetime not null,
            IDStare                 int not null,
            CONSTRAINT `comenzi_fk1` FOREIGN KEY (`id_utilizator`) REFERENCES `utilizatori` (`id`)
                    ON UPDATE CASCADE,
            CONSTRAINT `comenzi_fk2` FOREIGN KEY (`IDStare`) REFERENCES `stare_comenzi` (`id`)
                    ON UPDATE CASCADE
        )ENGINE = InnoDB; 
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql=<<<EOD
        create table detalii_comanda(
            id                      int auto_increment not null primary key,
            id_comenzi              int not null,
            id_articol              int not null,
            cantitate               int not null,
            CONSTRAINT detalii_comanda_fk1 FOREIGN KEY (id_comenzi) REFERENCES comenzi (nr_comanda)
                    ON UPDATE CASCADE,
            CONSTRAINT detalii_comanda_fk2 FOREIGN KEY (id_articol) REFERENCES articole (id)
                ON UPDATE CASCADE  
        )
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        echo "<p>Finished Creating tables</p>";
        echo "--------------------------------------------------------------------------------------------";
         $this->closeConection();
    }
    
   
    
}
?>
</div></body></html>