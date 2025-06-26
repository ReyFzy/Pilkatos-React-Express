-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 26, 2025 at 07:19 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pilkatos_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `candidate`
--

CREATE TABLE `candidate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tahun` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `visi` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `misi` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createAt` datetime(3) NOT NULL,
  `updateAt` datetime(3) NOT NULL,
  `ketuaId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wakilId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `banner` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `program` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate`
--

INSERT INTO `candidate` (`id`, `tahun`, `visi`, `misi`, `createAt`, `updateAt`, `ketuaId`, `wakilId`, `banner`, `program`) VALUES
('5a11b320-e6ef-4d2c-bc14-2aeccd3300af', '2024/2025', 'menjadi organisasi terbaik sepanjang masa', 'meningkatkan komunikasi antar kelas', '2025-03-09 06:17:02.080', '2025-03-10 04:07:05.103', '02166157-541b-4f92-8e9f-6d9d14efcdce', '74f776c1-f349-47c8-ad0b-4291b5819441', '/uploads/1741501021851-exbanner-16-9.jpg', 'Jumsih\nJumat Bersih yang akan dilaksanakan setiap hari Jumat di pagi hari'),
('c733abba-99e5-4b8b-bd96-7c8e5b49f38c', '2024/2025', 'Tumbuh lebih baik', 'Cari Panggilanmu', '2025-03-09 10:17:40.210', '2025-03-09 10:17:40.210', '9f0ca9cc-364f-4075-8ec4-0701238830e8', 'cf875e20-e3ce-4f74-aced-1ba377751173', '/uploads/1741515459339-exbanner-16-9.jpg', 'Gerakan pungut sampah');

-- --------------------------------------------------------

--
-- Table structure for table `ketua`
--

CREATE TABLE `ketua` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ketua`
--

INSERT INTO `ketua` (`id`, `userId`) VALUES
('9f0ca9cc-364f-4075-8ec4-0701238830e8', '001'),
('02166157-541b-4f92-8e9f-6d9d14efcdce', '00654321');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `NIS` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kelas` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `createAt` datetime(3) NOT NULL,
  `updateAt` datetime(3) NOT NULL,
  `refresh_token` text COLLATE utf8mb4_unicode_ci,
  `profilePic` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`NIS`, `nama`, `kelas`, `password`, `role`, `createAt`, `updateAt`, `refresh_token`, `profilePic`) VALUES
('001', 'Hanni', 'XII DKV 2', '$2b$10$eF28CwkG09R5MDpoWrYF5egS3f3OCnzZcyRHj9m2yE1q3gFR//lNK', 'USER', '2025-03-09 07:26:22.805', '2025-03-09 12:52:19.108', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOSVMiOiIwMDEiLCJuYW1hIjoiSGFubmkiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0MTU3OTYzOCwiZXhwIjoxNzQxNjY2MDM4fQ.k-Mp_ENe3lxvnTU-NMLOHaJX6TCQNocn5XsajTLYs54', 'http://localhost:5000/uploads/1741524738851-wp13212808-twinkling-watermelon-wallpapers.jpg'),
('00123456', 'Carmenita', 'XII AM 2', '$2b$10$Km/YcFz3PkG87ZAV0mvIVeu9Kw.xyw1VmmPpEpEjGYQAeZlRZDlz6', 'ADMIN', '2025-03-09 06:09:02.472', '2025-03-09 07:10:00.791', NULL, NULL),
('003', 'Haerin', 'XII TKJ 2', '$2b$10$RmixL35aAxwzsh6MulALKuVFZ8I1SLw6pwcSJRJBSC6q1qPiMGSom', 'USER', '2025-03-09 07:26:44.216', '2025-03-09 07:26:44.216', NULL, NULL),
('00654321', 'Rey', 'XII RPL 2', '$2b$10$dfqnpKiRUl7vzaTJbTwcduuPaoLXQ.Qw6M3gVsLeUQsnUJK7sxWXi', 'ADMIN', '2025-03-09 05:12:22.211', '2025-03-09 07:10:06.179', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOSVMiOiIwMDY1NDMyMSIsIm5hbWEiOiJSZXkiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTA5MjE2MTgsImV4cCI6MTc1MTAwODAxOH0.F9TMG565zFGA35FQddA0Y2ye3nigL9ykroNSYfpT9Jo', 'http://localhost:5000/uploads/1741498382649-carmen.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `wakil`
--

CREATE TABLE `wakil` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wakil`
--

INSERT INTO `wakil` (`id`, `userId`) VALUES
('74f776c1-f349-47c8-ad0b-4291b5819441', '00123456'),
('cf875e20-e3ce-4f74-aced-1ba377751173', '003');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('2ea0c1b7-84fc-4c70-941e-84a877f237f0', 'bf5c0358c94cd6ddd1c4bb397df2615887e0bb65f11df72412aa2991ea9b4bdd', '2025-03-05 14:39:26.164', '20250305143925_add_unique_userid', NULL, NULL, '2025-03-05 14:39:25.849', 1),
('400392a2-9bf8-4412-bc36-a12ad6338d1d', 'ecf624a82d5a95142628254dd558eb48d39a5e2b0b8cf294b0bd1de3ca5ea06c', '2025-03-09 05:03:42.673', '20250309050342_merge_programs_table_to_candidates_table', NULL, NULL, '2025-03-09 05:03:42.510', 1),
('60cb4dcc-ea25-4fd3-86ab-65d7ddd5c9c8', '8439123198f8c794e994867d13cd1957780514d0c57e5cdf7bdc435baf0b655a', '2025-02-19 04:22:14.926', '20250219042214_init', NULL, NULL, '2025-02-19 04:22:14.087', 1),
('ad26a7d5-de36-47bd-aa94-a5325dc69c0d', '62f54700fc82d074e71e6991e8245ce5f77621b8fe1c200d95925f2911da1c33', '2025-03-05 14:45:40.754', '20250305144540_remove_option_guest_in_enum_role', NULL, NULL, '2025-03-05 14:45:40.675', 1),
('b5936352-6063-4ce5-8a11-a2dac6a53192', '1b53008998e214056149580444a67cf18b8aad8da85947ddc4c9a4ea9ca3442d', '2025-03-05 13:31:26.877', '20250305133126_make_refresh_token_nullable', NULL, NULL, '2025-03-05 13:31:26.739', 1),
('e466eebb-1a7a-4083-bc51-732b5a1aa653', '45506bd569963c767d9354ca4db66e72815cf656b8e4e7f3f5d12ba5a8d29e94', '2025-03-09 07:03:44.887', '20250309070344_fix_refresh_token', NULL, NULL, '2025-03-09 07:03:44.703', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidate`
--
ALTER TABLE `candidate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Candidate_ketuaId_fkey` (`ketuaId`),
  ADD KEY `Candidate_wakilId_fkey` (`wakilId`);

--
-- Indexes for table `ketua`
--
ALTER TABLE `ketua`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Ketua_userId_key` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`NIS`),
  ADD UNIQUE KEY `User_nama_key` (`nama`);

--
-- Indexes for table `wakil`
--
ALTER TABLE `wakil`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Wakil_userId_key` (`userId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidate`
--
ALTER TABLE `candidate`
  ADD CONSTRAINT `Candidate_ketuaId_fkey` FOREIGN KEY (`ketuaId`) REFERENCES `ketua` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `Candidate_wakilId_fkey` FOREIGN KEY (`wakilId`) REFERENCES `wakil` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `ketua`
--
ALTER TABLE `ketua`
  ADD CONSTRAINT `Ketua_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`NIS`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `wakil`
--
ALTER TABLE `wakil`
  ADD CONSTRAINT `Wakil_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`NIS`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
