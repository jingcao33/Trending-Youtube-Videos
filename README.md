# Trending-YouTube-Video
Top 100 trending youtube videos from Nov, 2017 to Dec, 2018.

This project uses D3 and HTML/CSS to make a series of bubble charts with animation and interaction. We visualized the data such as number of views, like, dislike, comments of videos,publish date,and trending date on Youtube in the United States from November 2017 to June 2018 to see if there is any correlation between those factors.

## deployed page url
https://jingcao33.github.io/Trending-Youtube-Videos/index.html

## Data
We retrieved the data from https://www.kaggle.com/datasnaek/youtube-new. The raw dataset is collected from YouTube API, which is "a daily record of the top trending YouTube videos" (Mitchell J., 2019). The dataset includes more than 10 countries like US, Canada, Great Britain, etc.

### Data Cleaning
We focus on the top 100 videos based on the number of views in US dataset for this project. There are two files, "USvideos.csv" and "US_category_id.json". First, we "innerjoined" the category name in the json file to the csv based on the category_id. Then, we only remained the columns(variables) we need, including video_id, title, comment_count, dislikes, likes, views, category_id, category_name, trending_date, publish_date. To better demonstrate our charts, we manipulated the data and created new columns including rate_of_likes_and_dislikes(likes/dislikes), duration(the most recently trending_date - publish_date), and views_per_day (views/duration). Before we were able to create the column duration, we need to re-format the trending_date and publish_date to convert them from string to time format for futher calculation. At last, we ranked the views from the largest to the smallest to get only the top 100 videos. The final cleaned data is saved in the file "video_dataset.csv".
When we looked at the cleaned data, we found that the date (basically month) is a factor to effect the number of view as well.  Since each video has different publish date, trending date, and duration, we calculated the average of views_per_day for each month and created a new csv file called "month_view.csv".

### Findings
1. Most trending videos fall in the category of "Music" and "Entertainment" videos also attract a large portion of the popularity. Our finding corresponds with the original findings that the top performers on the trending list are music videos, "celebrity and/or reality TV performances", and "the random dude-with-a-camera viral videos that YouTube is well-known for" (Mitchell J., 2019).

2. Low rate of likes/dislikes indicates the video is controversial. And videos with many comments tend to have a low rate of likes/dislikes. Besides, people prefer upvoting music videos over making a comment, which is reasonable that upvoting takes much less effort and time than writing a comment.

3. The average views per day shows how the traffic on Youtube varies over the course of a period of time. We found that more people are using Youtube during November and December because people have more spare time over vocation.

## Charts
### Type of Videos & Number of Views
Each bubble represents a specific video, the size of the bubble shows the total number of views. And we use colors to indicate each category. We use different scale function like scaleOrdinal() and scaleSqrt() to map the data to the graphic. Force layout is used to achive the results that bubbles are attracted to each other but not overlapped to form a big circle. Legends are also drawn by D3 with svg. When you hover over the circle, more details including the title of video, the name of category and the number of views will appear.

### Like/Dislike Ratio & Number of Comments
We use the same bubble and color as the first chart to indicate each video and category. We use different scale function like scaleOrdinal() and scaleSqrt() to map the data to the graphic. We create X axis and Y axis instead of force layout and import data from dataset to detmine circle's position. Then, we use Hightlight/Unhighlight function to set different opacity based on which category of legend is hovered. When you hover over the circle, more details including the title of video, number of comments, and rate of like/Dislikes will appear.


### Average Views per Day Over 6 Months
The lollipop chart is also a result of D3. We also use axis and coordinates to determine the circle's position. We combined lines and circles to appear as a lollipop. To achieve the animation, we use 0 as orginal x coordinate, and then use transition function with duration and set new coordinate.

Referenece:
Trending YouTube Video Statistics. Mitchell J. 2019. Retrived from https://www.kaggle.com/datasnaek/youtube-new.
https://www.d3-graph-gallery.com/index.html
