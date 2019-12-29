-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 28 Des 2019 pada 09.17
-- Versi server: 10.4.10-MariaDB
-- Versi PHP: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myangkringan`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `cart`
--

CREATE TABLE `cart` (
  `id` int(8) NOT NULL,
  `id_user` int(8) NOT NULL,
  `id_item` int(8) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `qty` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `cart`
--

INSERT INTO `cart` (`id`, `id_user`, `id_item`, `created_on`, `updated_on`, `qty`) VALUES
(6, 14, 3, '2019-12-26 13:20:47', '2019-12-26 13:20:47', 4),
(7, 14, 3, '2019-12-26 13:21:04', '2019-12-26 13:21:04', 4);

-- --------------------------------------------------------

--
-- Struktur dari tabel `item`
--

CREATE TABLE `item` (
  `id` int(8) NOT NULL,
  `name` varchar(40) NOT NULL,
  `price` int(100) NOT NULL,
  `image` varchar(255) NOT NULL,
  `rating` float NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_restaurant` int(8) DEFAULT NULL,
  `id_category` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `item`
--

INSERT INTO `item` (`id`, `name`, `price`, `image`, `rating`, `created_on`, `updated_on`, `id_restaurant`, `id_category`) VALUES
(6, 'rendang', 15000, 'public/images/uploads/item/image-1577462851272.jpg.jpg', 0, '2019-12-27 16:07:31', '2019-12-27 16:07:31', 10, 3),
(7, 'rendang', 15000, 'public/images/uploads/item/image-1577462856427.jpg.jpg', 0, '2019-12-27 16:07:36', '2019-12-27 16:07:36', 12, 3),
(8, 'rendang', 15000, 'public/images/uploads/item/image-1577462864241.jpg.jpg', 0, '2019-12-27 16:07:44', '2019-12-27 16:07:44', 11, 3),
(9, 'Bakso', 25000, 'public/images/uploads/item/image-1577462939718.jpg.jpg', 0, '2019-12-27 16:08:59', '2019-12-27 16:08:59', 9, 3),
(10, 'Gado-Gado', 27000, 'public/images/uploads/item/image-1577513528882.jpg.jpg', 0, '2019-12-28 06:12:08', '2019-12-28 06:12:08', 9, 3),
(11, 'Gado-Gado', 27000, 'public/images/uploads/item/image-1577513536023.jpg.jpg', 0, '2019-12-28 06:12:16', '2019-12-28 06:12:16', 10, 3),
(12, 'Gado-Gado', 27000, 'public/images/uploads/item/image-1577513541280.jpg.jpg', 0, '2019-12-28 06:12:21', '2019-12-28 06:12:21', 11, 3),
(13, 'Gado-Gado', 27000, 'public/images/uploads/item/image-1577513545477.jpg.jpg', 0, '2019-12-28 06:12:25', '2019-12-28 06:12:25', 12, 3),
(14, 'Nasi Campur', 13000, 'public/images/uploads/item/image-1577513756087.jpg.jpg', 0, '2019-12-28 06:15:56', '2019-12-28 06:15:56', 11, 3),
(15, 'Nasi Campur', 13000, 'public/images/uploads/item/image-1577513762665.jpg.jpg', 0, '2019-12-28 06:16:02', '2019-12-28 06:16:02', 12, 3),
(16, 'Pisang Goreng ', 9000, 'public/images/uploads/item/image-1577513962231.jpg.jpg', 0, '2019-12-28 06:19:22', '2019-12-28 06:19:22', 11, 2),
(17, 'Pisang Goreng ', 9000, 'public/images/uploads/item/image-1577513967229.jpg.jpg', 0, '2019-12-28 06:19:27', '2019-12-28 06:19:27', 12, 2),
(18, 'Opor Ayama ', 14000, 'public/images/uploads/item/image-1577514816399.jpg.jpg', 0, '2019-12-28 06:33:36', '2019-12-28 06:33:36', 12, 3),
(19, 'Opor Ayama ', 14000, 'public/images/uploads/item/image-1577514820775.jpg.jpg', 0, '2019-12-28 06:33:40', '2019-12-28 06:33:40', 11, 3),
(20, 'Opor Ayam', 14000, 'public/images/uploads/item/image-1577514827007.jpg.jpg', 0, '2019-12-28 06:33:47', '2019-12-28 06:33:47', 9, 3),
(21, 'Roti Panggan', 5000, 'public/images/uploads/item/image-1577515307680.jpg.jpg', 0, '2019-12-28 06:41:47', '2019-12-28 06:41:47', 11, 2),
(22, 'Roti Panggan', 5000, 'public/images/uploads/item/image-1577515311686.jpg.jpg', 0, '2019-12-28 06:41:51', '2019-12-28 06:41:51', 12, 2),
(23, 'Dim Sum', 12000, 'public/images/uploads/item/image-1577515356927.jpg.jpg', 0, '2019-12-28 06:42:36', '2019-12-28 06:42:36', 12, 2),
(24, 'Dim Sum', 12000, 'public/images/uploads/item/image-1577515360131.jpg.jpg', 0, '2019-12-28 06:42:40', '2019-12-28 06:42:40', 11, 2),
(25, 'Dim Sum', 12000, 'public/images/uploads/item/image-1577515367171.jpg.jpg', 0, '2019-12-28 06:42:47', '2019-12-28 06:42:47', 9, 2),
(26, 'CHili Nachos', 11000, 'public/images/uploads/item/image-1577515864136.jpg.jpg', 0, '2019-12-28 06:51:04', '2019-12-28 06:51:04', 7, 4),
(27, 'CHili Nachos', 11000, 'public/images/uploads/item/image-1577515873551.jpg.jpg', 0, '2019-12-28 06:51:13', '2019-12-28 06:51:13', 8, 4),
(28, 'Omelet', 11000, 'public/images/uploads/item/image-1577515895851.jpg.jpg', 0, '2019-12-28 06:51:35', '2019-12-28 06:51:35', 11, 3),
(29, 'ice blend', 13000, 'public/images/uploads/item/image-1577515935347.jpg.jpg', 0, '2019-12-28 06:52:15', '2019-12-28 06:52:15', 11, 3),
(30, 'ice blend', 13000, 'public/images/uploads/item/image-1577515941424.jpg.jpg', 0, '2019-12-28 06:52:21', '2019-12-28 06:52:21', 7, 3),
(31, 'Milk Shake', 7000, 'public/images/uploads/item/image-1577515972676.jpg.jpg', 0, '2019-12-28 06:52:52', '2019-12-28 06:52:52', 11, 4),
(32, 'Milk Shake', 7000, 'public/images/uploads/item/image-1577515983089.jpg.jpg', 0, '2019-12-28 06:53:03', '2019-12-28 06:53:03', 7, 4),
(33, 'Es Teh', 5000, 'public/images/uploads/item/image-1577516012224.jpg.jpg', 0, '2019-12-28 06:53:32', '2019-12-28 06:53:32', 11, 4),
(34, 'Es Teh', 5000, 'public/images/uploads/item/image-1577516015638.jpg.jpg', 0, '2019-12-28 06:53:35', '2019-12-28 06:53:35', 12, 4),
(35, 'Kopi Hanget', 7000, 'public/images/uploads/item/image-1577516043533.jpg.jpg', 0, '2019-12-28 06:54:03', '2019-12-28 06:54:03', 11, 4),
(36, 'Moccachino', 10000, 'public/images/uploads/item/image-1577516062000.jpg.jpg', 0, '2019-12-28 06:54:22', '2019-12-28 06:54:22', 11, 4),
(37, 'Susu Putih', 6000, 'public/images/uploads/item/image-1577516117971.jpg.jpg', 0, '2019-12-28 06:55:18', '2019-12-28 06:55:18', 11, 4),
(38, 'Paket Ayam ', 26000, 'public/images/uploads/item/image-1577516151809.jpg.jpg', 0, '2019-12-28 06:55:51', '2019-12-28 06:55:51', 7, 3),
(39, 'Paket Ayam ', 26000, 'public/images/uploads/item/image-1577516156094.jpg.jpg', 0, '2019-12-28 06:55:56', '2019-12-28 06:55:56', 9, 3),
(40, 'Paket Ayam ', 26000, 'public/images/uploads/item/image-1577516168777.jpg.jpg', 0, '2019-12-28 06:56:08', '2019-12-28 06:56:08', 8, 3),
(41, 'Paket Ayam Combo', 46000, 'public/images/uploads/item/image-1577516189071.jpg.jpg', 0, '2019-12-28 06:56:29', '2019-12-28 06:56:29', 8, 3),
(42, 'Paket Ayam Combo', 46000, 'public/images/uploads/item/image-1577516192940.jpg.jpg', 0, '2019-12-28 06:56:32', '2019-12-28 06:56:32', 7, 3),
(43, 'Paket Ayam Combo', 46000, 'public/images/uploads/item/image-1577516194294.jpg.jpg', 0, '2019-12-28 06:56:34', '2019-12-28 06:56:34', 7, 3),
(44, 'Paket Ayam Burger', 39000, 'public/images/uploads/item/image-1577516219781.jpg.jpg', 0, '2019-12-28 06:56:59', '2019-12-28 06:56:59', 7, 3),
(45, 'Paket Ayam Burger', 39000, 'public/images/uploads/item/image-1577516226057.jpg.jpg', 0, '2019-12-28 06:57:06', '2019-12-28 06:57:06', 8, 3),
(46, 'Paket Burger', 22000, 'public/images/uploads/item/image-1577516262612.jpg.jpg', 0, '2019-12-28 06:57:42', '2019-12-28 06:57:42', 5, 3),
(47, 'Paket Burger keju', 27000, 'public/images/uploads/item/image-1577516285827.jpg.jpg', 0, '2019-12-28 06:58:05', '2019-12-28 06:58:05', 5, 3),
(48, 'Fanta', 8000, 'public/images/uploads/item/image-1577516318855.jpg.jpg', 0, '2019-12-28 06:58:38', '2019-12-28 06:58:38', 5, 4),
(49, 'Fanta', 8000, 'public/images/uploads/item/image-1577516322515.jpg.jpg', 0, '2019-12-28 06:58:42', '2019-12-28 06:58:42', 7, 4),
(50, 'Fanta', 8000, 'public/images/uploads/item/image-1577516328341.jpg.jpg', 0, '2019-12-28 06:58:48', '2019-12-28 06:58:48', 8, 4);

-- --------------------------------------------------------

--
-- Struktur dari tabel `restaurant`
--

CREATE TABLE `restaurant` (
  `id` int(8) NOT NULL,
  `name` varchar(60) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `description` text NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `restaurant`
--

INSERT INTO `restaurant` (`id`, `name`, `logo`, `longitude`, `latitude`, `description`, `created_on`, `updated_on`) VALUES
(5, 'MCDONAL', 'public/images/uploads/restaurant/image-1577327956625', 0.45, 4.55, 'arung makan mahalw', '2019-12-26 02:39:16', '2019-12-26 02:39:16'),
(7, 'KFC', 'public/images/uploads/restaurant/image-1577369096231.jpg', 0.45, 4.55, 'ayam bekas kemarin', '2019-12-26 14:04:56', '2019-12-26 14:04:56'),
(8, 'Richeese Factory Buah Batu', 'public/images/uploads/restaurant/image-1577428615805.jpg', -6.9458393, 107.6311576, 'Restoran Cepat Saji', '2019-12-27 06:36:55', '2019-12-27 06:36:55'),
(9, 'HokBen Buah Batu', 'public/images/uploads/restaurant/image-1577429199315.jpg', -6.9434244, 107.6288241, 'Restoran Jepang', '2019-12-27 06:46:39', '2019-12-27 06:46:39'),
(10, 'Bakso Tengkleng Mas Bambang Buahbatu', 'public/images/uploads/restaurant/image-1577429233795.jpg', -6.9451098, 107.6300847, 'Rumah makan bakso', '2019-12-27 06:47:13', '2019-12-27 06:47:13'),
(11, 'Warunk Upnormal Buah Batu', 'public/images/uploads/restaurant/image-1577429580535.jpg', -6.9425271, 107.6270002, 'kafe', '2019-12-27 06:53:00', '2019-12-27 06:53:00'),
(12, 'Eat Boss Buah Batu', 'public/images/uploads/restaurant/image-1577429632523.jpg', -6.9413396, 107.6269036, 'restauran cepat saji', '2019-12-27 06:53:52', '2019-12-27 06:53:52'),
(13, 'Prima rasa', 'public/images/uploads/restaurant/image-1577431573556.jpg', -6.9413396, 107.6264536, 'Toko Kue', '2019-12-27 07:26:13', '2019-12-27 07:26:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id` int(8) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `roles` varchar(10) NOT NULL,
  `id_restaurant` int(8) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `roles`, `id_restaurant`, `created_on`, `updated_on`) VALUES
(1, 'admin', '$2a$10$fIzLyPavpBR//S8RJrh9qetFLzvGyOrKsRSFHXLlxa1PbkidBb/Ju', 'admin', NULL, '2019-12-25 05:28:59', '2019-12-27 07:25:43'),
(2, 'qwerty', '$2a$10$e74s/DLFpHnk9D00NUzi0uAIh2k3u7m0ApxU801JZomwFxI7TnFgu', '', NULL, '2019-12-25 05:36:26', '2019-12-25 05:36:26'),
(3, 'aul', '$2a$10$I4b2PXC1AIhKpoJ7fW7ghuc6P3R9GOd8ep/fPZ5gET7x1dOOmJjuq', '', NULL, '2019-12-25 06:20:19', '2019-12-25 06:20:19'),
(4, 'auliar', '$2a$10$W2S3QsW.vioMlfGsJeFuI.gqrfLsA0Lpu25dSeS2JguYWJ4CLPcUC', 'customer', 1, '2019-12-25 06:22:06', '2019-12-26 13:43:53'),
(6, 'auliaram', '$2a$10$flTmsQEQfseloWAvDyFK1u1M5HF7ozid3qaFEwkQPUG4N7AkYqgey', 'manager', 1, '2019-12-25 06:25:36', '2019-12-25 06:25:36'),
(12, 'auliamanager', '$2a$10$7jcoIdPSIv3kejZfdJFmhOZXrPhCYI3TEWviAh2b5tK0ESspOq0lq', 'manager', 1, '2019-12-26 01:37:36', '2019-12-26 01:37:36'),
(13, 'auliamanager2', '$2a$10$e8XA11svoNtBMc8jOcor1OrrhsMhl1B8CAyXmkCGCgsBp6vjqFp0i', 'manager', 2, '2019-12-26 04:58:15', '2019-12-26 04:58:15'),
(14, 'aulcustomer', '$2a$10$Zq3qo5ygSyUsaExV.1uFy.mwr7N4/najuee3A.vVxdAbj0ewgAATO', 'customer', NULL, '2019-12-26 05:33:32', '2019-12-27 16:00:02'),
(15, 'aulcoba', '$2a$10$58Ta7.rNzhpQhFI2yv3/ducA687hwDGHZxP4P.yXcq/nm4aQCXaQa', 'customer', NULL, '2019-12-26 15:58:09', '2019-12-26 15:58:09'),
(16, 'aulcustomer2', '$2a$10$F38AUf7TCSPT7NUFHLdM8uf6PbgFrDpLawXcp/DhNRcsl2Yg0qJUu', 'customer', NULL, '2019-12-27 07:29:46', '2019-12-27 07:29:46');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_item` (`id_item`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_restaurant` (`id_restaurant`),
  ADD KEY `rating` (`rating`);

--
-- Indeks untuk tabel `restaurant`
--
ALTER TABLE `restaurant`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_username` (`username`),
  ADD KEY `id_restaurant` (`id_restaurant`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `item`
--
ALTER TABLE `item`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT untuk tabel `restaurant`
--
ALTER TABLE `restaurant`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `item_ibfk_1` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
