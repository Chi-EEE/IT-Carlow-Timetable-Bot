using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using DiscordBot.Commands;
using Microsoft.Extensions.Logging;
using LogLevel = Microsoft.Extensions.Logging.LogLevel;

using DSharpPlus; //Discord
using DSharpPlus.CommandsNext;
using DSharpPlus.EventArgs;
using Newtonsoft.Json;
using DSharpPlus.CommandsNext.Attributes;

using HtmlAgilityPack; // HTML
using Quartz;
using Quartz.Impl;
using Quartz.Logging;
using System.Security.Cryptography.X509Certificates;
using DSharpPlus.Entities;

namespace DiscordBot
{
    public class Bot
    {
        static public DiscordClient Client { get; private set; }
        public CommandsNextExtension Commands { get; private set; }
        static public ConfigJson configJson { get; private set; }
        public async Task RunAsync()
        {
            string json = string.Empty;
            using (var fs = File.OpenRead("config.json"))
            using (var sr = new StreamReader(fs, new UTF8Encoding(false)))
                json = await sr.ReadToEndAsync().ConfigureAwait(false);

            configJson = JsonConvert.DeserializeObject<ConfigJson>(json);
            DiscordConfiguration config = new DiscordConfiguration
            {
                Token = configJson.Token,
                TokenType = TokenType.Bot,
                AutoReconnect = true,
                MinimumLogLevel = LogLevel.Debug
            };
            Client = new DiscordClient(config);

            Client.Ready += OnClientReady;

            //DiscordGuild server = await Client.GetGuildAsync(Convert.ToUInt64(configJson.ServerId));
            //DiscordChannel channel = server.GetChannel(Convert.ToUInt64(configJson.ChannelId));
            //await channel.SendMessageAsync("@everyone: Bot Ready " + DateTime.Now.ToString("h:mm:ss tt"));

            var commandsConfig = new CommandsNextConfiguration
            {
                StringPrefixes = new string[] { configJson.Prefix },
                EnableDms = false,
                EnableMentionPrefix = true,
                DmHelp = true,
            };

            Commands = Client.UseCommandsNext(commandsConfig);
            //Add commands here
            Commands.RegisterCommands<InfoCommands>();
            //
            await Client.ConnectAsync();

            GetTimetable();
            //Timetable function
            async void GetTimetable()
            {
                short dayNumberOfWeek = (short)DateTime.Now.DayOfWeek;
                if (dayNumberOfWeek >= 1 & dayNumberOfWeek <= 6)
                {
                    dayNumberOfWeek += -1;
                    StdSchedulerFactory factory = new StdSchedulerFactory();
                    IScheduler scheduler = await factory.GetScheduler();

                    //Timetable Website
                    string html = @configJson.Website;
                    HtmlWeb web = new HtmlWeb();

                    var htmlDoc = web.Load(html);

                    string[] activites = new string[30]; //Activities array

                    short[][] clockDays = {
                new short[6],
                new short[6],
                new short[6],
                new short[6],
                new short[6],
                };

                    string[][] activityDays = {
                new string[6],
                new string[6],
                new string[6],
                new string[6],
                new string[6],
                };


                    short indexActivity = 0;
                    foreach (HtmlNode activityNode in htmlDoc.DocumentNode.SelectNodes("//body/table/tr/td[1]")) //Goes through subject name html
                    {
                        string subjectName = (activityNode.InnerHtml);
                        if (!subjectName.Contains("table")) //filters out the useless information
                        {
                            activites[indexActivity] = subjectName; //puts it in array for later use
                            indexActivity++;
                        }
                    }

                    short currentActivity = -1;
                    short currentWeekday = -1;
                    short currentEntryAmount = 0;
                    foreach (HtmlNode timeNode in htmlDoc.DocumentNode.SelectNodes("//body/table/tr/td[4]")) // Goes through time html
                    {
                        currentActivity++;
                        string clockTime = (timeNode.InnerHtml);
                        if (clockTime == "Start")
                        {
                            currentWeekday++;
                            currentEntryAmount = 0;
                        }
                        else
                        {
                            clockTime = clockTime.Replace(":00", "");
                            activityDays[currentWeekday][currentEntryAmount] = activites[currentActivity];
                            clockDays[currentWeekday][currentEntryAmount] = Int16.Parse(clockTime);
                            currentEntryAmount++;
                        }

                    }

                    IJobDetail job = JobBuilder.Create<HelloJob>()
                               .WithIdentity("Job", "Subject")
                               .StoreDurably()
                               .Build();
                    await scheduler.AddJob(job, false);
                    for (short s = 0; s < clockDays[dayNumberOfWeek].Length ; s++)
                    {
                        short clockTime = clockDays[dayNumberOfWeek][s];
                        string activity = activityDays[dayNumberOfWeek][s];
                        if (clockTime > 0)
                        {
                            await scheduler.Start();

                            ITrigger trigger = (ITrigger)TriggerBuilder.Create()
                                .WithIdentity((activity + s), "Subject")
                                .StartAt(new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).Add(new TimeSpan((clockTime - 1),45,0)))
                                .ForJob(job)
                                .Build();
                            trigger.JobDataMap["data"] = new string[] { clockTime.ToString(), activity };
                            await scheduler.ScheduleJob(trigger);
                        }
                    }
                }
                else
                {
                    Console.WriteLine("This Program only works on weekdays.");
                }
            }
            
    await Task.Delay(-1);
    }
        private Task OnClientReady(object sender, ReadyEventArgs e)
        {
            Console.WriteLine("Bot Ready");
            return Task.CompletedTask;
        }
        
    }
    public class HelloJob : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {
            JobDataMap dataMap = context.Trigger.JobDataMap;
            string[] data = (string[])dataMap["data"];
            DiscordGuild server = await Bot.Client.GetGuildAsync(Convert.ToUInt64(Bot.configJson.ServerId));
            DiscordChannel channel = server.GetChannel(Convert.ToUInt64(Bot.configJson.ChannelId));
            await channel.SendMessageAsync("@everyone: " + data[0] + ":00. It's almost \u0022" + data[1] + "\u0022 time!");
        }
    }
}