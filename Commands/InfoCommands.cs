using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

//DSharp
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;

namespace DiscordBot.Commands
{
    public class InfoCommands : BaseCommandModule
    {
        [Command("ping")]
        [Description("Returns Pong")]
        [RequireRoles(RoleCheckMode.All)]
        public async Task Ping(CommandContext ctx)
        {
            await ctx.Channel
                .SendMessageAsync("Pong")
                .ConfigureAwait(false);
        }

        [Command("info")]
        [Description("Gives Information about the Bot")]
        [RequireRoles(RoleCheckMode.All)]
        public async Task Info(CommandContext ctx)
        {
            await ctx.Channel
                .SendMessageAsync("Made by Huu Chi Huynh, Date: 26/10/2020")
                .ConfigureAwait(false);
        }
        //[Command("add")]
        //[Description("Adds Two Numbers Together")]
        //[RequireRoles(RoleCheckMode.All, "Moderator")]
        //public async Task Add(CommandContext ctx,
        //    [Description("Number 1")] int numberOne,
        //    [Description("Number 2")] int numberTwo)
        //{
        //    await ctx.Channel
        //        .SendMessageAsync((numberOne + numberTwo).ToString())
        //        .ConfigureAwait(false);
        //}
    }
}
