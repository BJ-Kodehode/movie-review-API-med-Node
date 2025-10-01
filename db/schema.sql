-- Create database objects for Fjellfilm Movie Review API

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'fjellfilm')
BEGIN
  PRINT 'Ensure database fjellfilm exists (create manually if needed).';
END
GO

IF OBJECT_ID(N'dbo.Reviews', N'U') IS NOT NULL DROP TABLE dbo.Reviews;
IF OBJECT_ID(N'dbo.Movies', N'U') IS NOT NULL DROP TABLE dbo.Movies;
GO

CREATE TABLE dbo.Movies (
  id INT IDENTITY(1,1) PRIMARY KEY,
  title NVARCHAR(255) NOT NULL,
  director NVARCHAR(255) NULL,
  releaseYear INT NOT NULL,
  genre NVARCHAR(100) NULL
);
GO

CREATE TABLE dbo.Reviews (
  id INT IDENTITY(1,1) PRIMARY KEY,
  movieId INT NOT NULL,
  reviewAuthor NVARCHAR(255) NOT NULL,
  reviewText NVARCHAR(MAX) NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT FK_Reviews_Movies FOREIGN KEY (movieId) REFERENCES dbo.Movies(id) ON DELETE CASCADE
);
GO

