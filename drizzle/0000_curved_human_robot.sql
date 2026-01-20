CREATE TYPE "public"."rating" AS ENUM('positive', 'negative');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "chatLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"userMessage" text NOT NULL,
	"assistantMessage" text NOT NULL,
	"language" varchar(10) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chatRatings" (
	"id" serial PRIMARY KEY NOT NULL,
	"chatLogId" integer NOT NULL,
	"rating" "rating" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"content" varchar(300) NOT NULL,
	"image1" text,
	"image2" text,
	"image3" text,
	"image4" text,
	"image5" text,
	"image6" text,
	"image7" text,
	"image8" text,
	"image9" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
