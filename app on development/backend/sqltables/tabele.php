<?php
/*
-------------------------------------------------------------
    DROP Table if wanted

    drop table comenzi
    drop table stare_comenzi
    drop table articole
    drop table utilizatori
-------------------------------------------------------------

    Tabele Comenzi Magazine

    create table utilizatori(
        id                      int auto_increment not null primary key,
        nume_utilizator         varchar(40) unique not null,
        locatie_utilizator      varchar(60) not null,
        parola_utilizator       varchar(100) not null,
        ultima_logare           datetime
    )ENGINE = InnoDB; 

    create table articole(
        id                      int auto_increment not null primary key,
        nume_articol            varchar(100) unique not null,
        cantitate_stoc          int not null,
        pret                    float not null,
        status                  varchar(20) not null
    )ENGINE = InnoDB; 

    create table stare_comenzi(
        id                      int auto_increment not null primary key,
        nume_stare              varchar(40) unique not null
    )ENGINE = InnoDB; 

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
-------------------------------------------------------------

Input Fake into stare_comenzi
INSERT INTO stare_comenzi (nume_stare) VALUES ('Comanda Nevizualizata'),('Comanda Vizualizata'),('Comanda Rezolvata'),('Comanda Anulata');

Input Fake into utilizatori
INSERT INTO utilizatori (nume_utilizator, locatie_utilizator,parola_utilizator) VALUES ('G10', 'Casa Alba','G10'),
('G11', 'Carpati II','G11'),
('G12', 'Negresti Oas','G12'),
('G13', 'Tasnad','G13'),
('G15', 'Carei Supermarket','G15'),
('G16', 'Sighetu Marmatiei','G16'),
('G17', 'Borsa','G17'),
('G18', 'Viseul de sus','G18'),
('G20', 'Bistrita','G20'),
('G21', 'Vatra Dornei','G21'),
('G22', 'Zalau 1','G22'),
('G23', 'Zalau 2','G23'),
('G24', 'Simleu Silvaniei','G24'),
('G25', 'Cehu Silvaniei','G25'),
('G26', 'Jibou','G26'),
('G27', 'Marghita','G27'),
('G28', 'Gherla','G28'),
('G3', 'Piata Somes','G3'),
('G30', 'Dej','G30'),
('G31', 'Cluj 1 Primaverii','G31'),
('G32', 'Cluj 2 Calea Floresti','G32'),
('G33', 'Cluj 3 Pta Mihai Viteazu','G33'),
('G34', 'Cluj 4 Grigorescu','G34'),
('G35', 'Oradea Aluminei','G35'),
('G37', 'Oradea Transilvaniei','G37'),
('G38', 'Oradea Erofte','G38'),
('G39', 'Oradea Nufarului','G39'),
('G40', 'Turt','G40'),
('G42', 'Turt 2','G42'),
('G43', 'Valea lui Mihai','G43'),
('G44', 'Campulung Moldovenesc','G44'),
('G46', 'Gura Humorului','G46'),
('G47', 'Arad 1 Calea Aurel Vlaicu','G47'),
('G48', 'Arad 2 Pta Garii','G48'),
('G49', 'Arad 3 Pta Mihai Viteazu','G49'),
('G5', 'Carei Mic','G5'),
('G51', 'Stei','G51'),
('G52', 'Beius','G52'),
('G53', 'Deva 1 Dacia','G53'),
('G54', 'Deva 2 Bejan','G54'),
('G55', 'Deva 3 Progresului','G55'),
('G56', 'Deva 4 Kogalniceanu','G56'),
('G57', 'Cluj 6 Aurel Vlaicu','G57'),
('G58', 'Arad 4 Confectii','G58'),
('G6', 'Brindusa / Micro 16','G6'),
('G60', 'Arad 6 Micalaca','G60'),
('G61', 'Sannicolau','G61'),
('G62', 'Jimbolia','G62'),
('G63', 'Resita 1 Intim','G63'),
('G64', 'Resita 2 Triumf','G64'),
('G65', 'Lugoj 1 Timisoarei','G65'),
('G66', 'Lugoj 2 Bucegi','G66'),
('G67', 'Timisioara 1 Ciupercuta','G67'),
('G68', 'Timisioara 2 Sagului','G68'),
('G69', 'Timisioara 3 Iosefini','G69'),
('G7', 'Micro 15','G7'),
('G70', 'Timisioara 4 Gara','G70'),
('G72', 'Timisioara 6 Cugir','G72'),
('G73', 'Timisioara 7 Holdelor','G73'),
('G74', 'Timisioara 8 Lucaciu','G74'),
('G75', 'Ortisoara','G75'),
('G76', 'Timisoara 9 Lugojului','G76'),
('G78', 'Chisinau Cris','G78'),
('G8', 'Micro 17','G8'),
('G80', 'Ineu','G80'),
('G81', 'Lipova','G81'),
('G82', 'Sacueni','G82'),
('G83', 'Brad','G83'),
('G84', 'Sebis','G84'),
('G85', 'Falticeni','G85'),
('G86', 'Suceava 1','G86'),
('G87', 'Suceava 2','G87'),
('G88', 'Radauti','G88'),
('G89', 'Suceava 3','G89'),
('G9', 'Piata Mica','G9'),
('G91', 'Alesd','G91'),
('G92', 'Faget','G92'),
('G93', 'Periam','G93'),
('G94', 'Curtici','G94'),
('G95', 'Floresti','G95'),
('G96', 'Petrova','G96'),
('G97', 'Halmeu','G97'),
('G98', 'Oradea','G98'),
('G99', 'Brad II','G99'),
('G104', 'Vicovu de jos','G104'),
('G105', 'Vicovu de sus','G105'),
('G106', 'Rona de sus','G106'),
('G107', 'Bixad','G107'),
('G108', 'Mediesu Aurit','G108'),
('G109', 'Ulmeni','G109'),
('G110', 'Seini','G110'),
('G111', 'Dragomiresti','G111'),
('G112', 'Pancota','G112'),
('G113', 'Sagu','G113'),
('G114', 'Calinesti Oas','G114'),
('G115', 'Barsana','G115'),
('G116', 'Poienile de sub munte','G116'),
('G117', 'Odoreu','G117'),
('G50', 'Depozit Ortisoara Marfa','G50');

Input Fake into articole
INSERT INTO articole (nume_articol, cantitate_stoc,pret,status) VALUES('AGRAFE','100', '5','active'),
('ASCUTITOARE','64', '25','active'),
('BANDA ADEZIVA MARE','136', '13','active'),
('BANDA ADEZIVA MICA','110', '35','active'),
('BANDA DUBLA','54', '7','active'),
('BANDA DUBLU ADEZIVA','79', '4','active'),
('BIBLIORAFT','72', '38','active'),
('BILETELE GALBENE','81', '10','active'),
('BURETIERA','128', '26','active'),
('CAIET MIC','71', '30','active'),
('CAIET STUDENTESC','111', '33','active'),
('CALCULATOR','53', '14','active'),
('CAPSATOR','127', '17','active'),
('CAPSE','82', '41','active'),
('CARTUS CERNEALA CANON CLI 526 BK','138', '15','active'),
('CARTUS CERNEALA CANON CLI 526 C','150', '30','active'),
('CARTUS CERNEALA CANON CLI 526 M','106', '19','active'),
('CARTUS CERNEALA CANON CLI 526 Y','80', '48','active'),
('CARTUS CERNEALA CANON CLI 551 BK','63', '23','active'),
('CARTUS CERNEALA CANON CLI 551 C','102', '42','active'),
('CARTUS CERNEALA CANON CLI 551 M','79', '14','active'),
('CARTUS CERNEALA CANON CLI 551 Y','128', '42','active'),
('CARTUS CERNEALA CANON CLI 8 C','91', '36','active'),
('CARTUS CERNEALA CANON CLI 8 M','130', '10','active'),
('CARTUS CERNEALA CANON CLI 8 Y','150', '43','active'),
('CARTUS CERNEALA CANON PGI 5 BK','60', '38','active'),
('CARTUS CERNEALA CANON PGI 525 BK','68', '3','active'),
('CARTUS CERNEALA CANON PGI 550 BK','133', '16','active'),
('CLIPBOARD','74', '39','active'),
('CORECTOR','96', '14','active'),
('CREION','131', '25','active'),
('DECAPSATOR','96', '40','active'),
('DOSAR PLASTIC','66', '31','active'),
('FOARFECA','81', '15','active'),
('FOLIE PROTECTOARE','63', '10','active'),
('HARTIE A3','69', '23','active'),
('HARTIE A4','64', '15','active'),
('HARTIE A4 2 EX AUTOCOPIATIVA','67', '17','active'),
('LINIAR','114', '43','active'),
('MARKER GALBEN','116', '46','active'),
('MARKER NEGRU','96', '10','active'),
('MARKER NEGRU SUBTIRE','122', '40','active'),
('PERFORATOR','114', '26','active'),
('PIX ALBASTRU','140', '10','active'),
('PIX ROSU','146', '40','active'),
('PLIC MARE MARO','108', '6','active'),
('PLIC MIC','134', '24','active'),
('RADIERA','124', '25','active'),
('RIBON EPSON','70', '49','active'),
('RIBON EPSON LX350','145', '11','active'),
('ROLA FAX','147', '24','active'),
('TUS','58', '48','active');

Input Fake into comenzi
INSERT INTO comenzi (id_utilizator, data_comanda,IDStare) VALUES ('2','2019.04.05 12:05','1'),('3','2019.02.24 07:35','1'),('2','2019.02.24 07:55','2'),('6','2019.03.23 14:15','2'),('16','2019.03.29 16:29','4');

Input Fake into detalii_comanda
INSERT INTO detalii_comanda (id_comenzi, id_articol,cantitate) VALUES ('1','1','3'),('1','2','2'),('2','4','9'),('3','3','10'),('3','1','5'),('3','2','6'),('4','2','12'),('5','1','15');

*/

?>