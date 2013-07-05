package org.piecemaker2.models;

import java.util.ArrayList;
import java.util.Date;

/*
+------------+------------+------+-----+---------+----------------+
| Field      | Type       | Null | Key | Default | Extra          |
+------------+------------+------+-----+---------+----------------+
| id         | int(11)    | NO   | PRI | NULL    | auto_increment |
| piece_id   | int(11)    | YES  | MUL | NULL    |                |
| video_id   | int(11)    | YES  | MUL | NULL    |                |
| primary    | tinyint(1) | YES  |     | 0       |                |
| created_at | datetime   | YES  |     | NULL    |                |
| updated_at | datetime   | YES  |     | NULL    |                |
+------------+------------+------+-----+---------+----------------+
*/

public class VideoRecording
{
	public int id;
	public int pieceId;
	public int videoId;
	public boolean primary;
	public Date createdAt;
	public Date updatedAt;
}