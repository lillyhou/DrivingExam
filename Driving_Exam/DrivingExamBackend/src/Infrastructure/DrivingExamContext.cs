using Bogus;
using DrivingExamBackend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
namespace TodoBackend.Infrastructure
{
    public class DrivingExamContext : DbContext
    {
        public DbSet<Module> Modules => Set<Module>();
        public DbSet<Topic> Topics => Set<Topic>();
        public DbSet<Question> Questions => Set<Question>();
        public DbSet<Answer> Answers => Set<Answer>();


        public DrivingExamContext(DbContextOptions<DrivingExamContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                // Generic config for all entities
                // ON DELETE RESTRICT instead of ON DELETE CASCADE
                foreach (var key in entityType.GetForeignKeys())
                    key.DeleteBehavior = DeleteBehavior.Restrict;

                foreach (var prop in entityType.GetDeclaredProperties())
                {
                    // Define Guid as alternate key. The database can create a guid fou you.
                    if (prop.Name == "Guid")
                    {
                        modelBuilder.Entity(entityType.ClrType).HasAlternateKey("Guid");
                        prop.ValueGenerated = Microsoft.EntityFrameworkCore.Metadata.ValueGenerated.OnAdd;
                    }
                    // Default MaxLength of string Properties is 255.
                    if (prop.ClrType == typeof(string) && prop.GetMaxLength() is null) prop.SetMaxLength(255);
                    // Seconds with 3 fractional digits.
                    if (prop.ClrType == typeof(DateTime)) prop.SetPrecision(3);
                    if (prop.ClrType == typeof(DateTime?)) prop.SetPrecision(3);
                }
            }
        }

        public void Initialize(bool deleteDatabase = false)
        {
            if (deleteDatabase) Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        public void Seed()
        {
            Randomizer.Seed = new Random(1942);
            var faker = new Faker("de");

            // Define modules to seed
            Dictionary<int, Module> modulesToSeed = new Dictionary<int, Module>()
    {
        {  1, new Module(1, "Grundwissen") { Guid = faker.Random.Guid() } },
        {  2, new Module(2, "A spezifisch") { Guid = faker.Random.Guid() } },
        {  3, new Module(3, "B spezifisch") { Guid = faker.Random.Guid() } },
        {  4, new Module(4, "C spezifisch") { Guid = faker.Random.Guid() } },
        {  5, new Module(5, "D spezifisch") { Guid = faker.Random.Guid() } },
        {  6, new Module(6, "E spezifisch") { Guid = faker.Random.Guid() } },
        {  7, new Module(7, "F spezifisch") { Guid = faker.Random.Guid() } },
        {  8, new Module(8, "AM spezifisch") { Guid = faker.Random.Guid() } },
        { 10, new Module(10, "Fahrlehrerausbildung") { Guid = faker.Random.Guid() } }
    };

            // Load existing Modules from DB by Number
            var existingModules = Modules.AsNoTracking().ToDictionary(m => m.Number);

            // Add missing Modules
            foreach (var moduleKvp in modulesToSeed)
            {
                if (!existingModules.ContainsKey(moduleKvp.Key))
                {
                    Modules.Add(moduleKvp.Value);
                }
            }
            SaveChanges();

            // Reload modules dictionary to include existing + newly added
            var modules = Modules.ToDictionary(m => m.Number);

            // Load existing Topics by Name
            var existingTopics = Topics.AsNoTracking().ToDictionary(t => t.Name);

            Dictionary<string, Topic> topics = new Dictionary<string, Topic>(existingTopics);

            List<Question> questionsToAdd = new List<Question>();
            List<Answer> answersToAdd = new List<Answer>();

            using var questionsStreamReader = new StreamReader("questions.json", new UTF8Encoding(false));
            var questionsDocument = JsonDocument.Parse(questionsStreamReader.BaseStream).RootElement;

            // Load existing Questions by Number for quick lookup
            var existingQuestionNumbers = Questions.Select(q => q.Number).ToHashSet();

            foreach (var questionElement in questionsDocument.EnumerateArray())
            {
                int questionNumber = questionElement.GetProperty("questionNumber").GetInt32();

                // Skip question if already exists
                if (existingQuestionNumbers.Contains(questionNumber))
                    continue;

                string text = questionElement.GetProperty("questionText").GetString()
                    ?? throw new ApplicationException($"No questionText for Question {questionNumber}.");

                var pathArray = questionElement.GetProperty("path").EnumerateArray().Select(p => p.GetString()).ToArray();
                string topicName = pathArray.LastOrDefault()
                    ?? throw new ApplicationException($"No element in path array for Question {questionNumber}.");

                int moduleNumber = questionElement.GetProperty("classes").EnumerateArray().First().GetInt32();

                string? imageUrl = questionElement.TryGetProperty("imageUrl", out var imageUrlProp)
                    ? imageUrlProp.GetString() : null;

                var correctAnswersText = questionElement.GetProperty("correctAnswers")
                    .EnumerateArray().Select(q => q.GetString())
                    .Where(q => !string.IsNullOrEmpty(q)).ToList();

                if (correctAnswersText.Count == 0)
                    throw new ApplicationException($"No correct answers found for Question {questionNumber}.");

                var wrongAnswersText = questionElement.GetProperty("wrongAnswers")
                    .EnumerateArray().Select(q => q.GetString())
                    .Where(q => !string.IsNullOrEmpty(q)).ToList();

                if (!modules.TryGetValue(moduleNumber, out var moduleEntity))
                    throw new ApplicationException($"Invalid Module Number {moduleNumber} for Question {questionNumber}.");

                if (!topics.TryGetValue(topicName, out var topicEntity))
                {
                    topicEntity = new Topic(topicName) { Guid = faker.Random.Guid() };
                    Topics.Add(topicEntity);
                    topics.Add(topicName, topicEntity);
                }

                var questionEntity = new Question(
                    questionNumber, text, 1, moduleEntity, topicEntity, imageUrl)
                {
                    Guid = faker.Random.Guid()
                };

                questionsToAdd.Add(questionEntity);

                var answersEntities = correctAnswersText
                    .Select(t => new Answer(questionEntity, t!, true) { Guid = faker.Random.Guid() })
                    .Concat(wrongAnswersText
                        .Select(t => new Answer(questionEntity, t!, false) { Guid = faker.Random.Guid() }));

                answersToAdd.AddRange(answersEntities);
            }

            Questions.AddRange(questionsToAdd);
            Answers.AddRange(answersToAdd);

            SaveChanges();
        }
    }
}
