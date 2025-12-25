An engineering blog by Kieran Gill Scaling LLMs to larger codebases
Where to focus investments to best leverage AI tooling
This is the third part of a series on LLMs in software engineering.
First we learned what LLMs and genetics have in common. (part 1) LLMs don't improve all facets of engineering. So, understanding which areas LLMs do improve (part 2) is important for knowing how to focus our investments. (part 3)
How do we scale LLMs to larger codebases? Nobody knows yet. But by understanding how LLMs contribute to engineering, we realize that investments in guidance and oversight are worthwhile.
1 Guidance: The context, the environment.
2 Oversight: The skill set needed to guide, validate, and verify the implementor's1choices.
Investing in guidance
When an LLM can generate a working high-quality implementation in a single try, that is called one-shotting. This is the most efficient form of LLM programming.
The opposite of one-shotting is rework. This is when you fail to get a usable output from the LLM and must manually intervene.2 This often takes longer than just doing the work yourself.
So how do we create more opportunities for one-shotting? Better guidance.
Better guidance
LLMs are choice generators. Every set of tokens is a choice added to your codebase: how a variable is named, where to organize a function, whether to reuse/extend/or duplicate functionality to solve a problem, whether Postgres should be chosen over Redis, and so on.
Often, these choices are best left up to the designer (e.g., via the prompt). However, it's not efficient to exhaustively list all of these choices in a prompt. It's also not efficient to rework an LLM output whenever it gets these choices wrong.
In the ideal world, the prompt only captures the business requirements of a feature. The rest of the choices are either inferrable or encoded.
Write a prompt library
A prompt library is a set of documentation that can be included as context for an LLM.
Writing this is simple: collate documentation, best practices, a general map of the codebase, and other context an engineer needs to be productive in your codebase.3
Making a prompt library useful requires iteration. Every time the LLM is slightly off target, ask yourself, "What could've been clarified?" Then, add that answer back into the prompt library.
A prompt library needs to strike the right balance between comprehensive and lean.
Aside: Example usage of a prompt library.
You are helping me build a new feature. Here is the relevant documentation to onboard yourself to our system: - @prompts/How_To_Write_Views.md -- Our conventions and security practices for sanitizing inputs. - @prompts/How_To_Write_Unit_Tests.md -- Features should come with tests. Here are docs on creating test data and writing quality tests. - @prompts/Testing_Best_Practices.md -- How to make a test readable. When to DRY test data creation. - @prompts/The_API_File.md -- How to find pre-existing functionality in our system. Feature request: Extend our scheduler to allow for bulk uploads. - This will happen via a csv file with the format `name,start_time,end_time`. - Times are given in ET. - Please validate the user exists and that the start and end times don't overlap. You should also make sure there are no pre-existing events for a given row; we don't want duplicates. - I recommend by starting in @server/apps/scheduler/views.py`.
Or, better yet, the preamble is preloaded into the models context (for example, by using CLAUDE.md ).
Your prompt should be thorough enough to guide the LLM to the right choices. But verification is required. Read every line of generated code. Just because you told an LLM to sanitize inputs, doesn't mean it actually did.
The environment is your context
A peer at Meta told me that they weren't in a position to make Zuckerberg's engineering automation claims a reality. The reason is their codebase is riddled with technical debt. He wasn't surprised by this. Meta (apparently) historically has not prioritized paying down their debts.
Aside: What is technical debt, anyway? A good framework for understanding this is Jack Danger's Technical Debt Financing.
Compare this to the mentality from the Cursor team:
I think ultimately the principles of clean software are not that different when you want it to be read by people and by models. When you are trying to write clean code you want to, not repeat yourself, not make things more complicated than they need to be.
I think taste in code... is actually gonna become even more important as these models get better because it will be easier to write more and more code and so it'll be more and more important to structure it in a tasteful way.
This is the garbage in, garbage out principle in action. The utility of a model is bottlenecked by its inputs. The more garbage you have, the more likely hallucinations will occur.
Here's a LLM literacy dipstick: ask a peer engineer to read some code they're unfamiliar with. Do they understand it? Do they struggle to navigate it? If it's a module, can they quickly understand what all that module exposes? Do they know the implications of using a certain function, the side-effects they must be aware of? No? Then the LLM won't either.
Here's another dipstick: Ask an LLM agent to tell you how certain functionality works. You should know the answer before asking the LLM. Is their answer right? More importantly, how did they go about answering your question? Follow the LLM's trail and document its snags. You'll notice it tends to grep , ls , and cat to search. How can you give it a map so it isn't left to rediscover the codebase on each new prompt? When a map can't be given, how do you make it easier for them to navigate the codebase?
How you make the environment better suited for LLM literacy is dependent on the tech stack and domain. But general principles apply: modularity, simplicity, things are well-named, logic is encapsulated. Be consistent and encode these conventions in your prompt library.
Example: We're a Django shop. One way we enable readability is through encapsulation. In Django, the convention for doing so is through apps. Apps allow you to break up parts of the domain.
The entry point for an app is its API. Each app has an <app_name>_api.py file.4 This file exposes action-oriented functions to allow consumers to interact with the app's domain: visit_api.handoff_to_doctor(user) .
Readers do not need to understand the full context of the app in order to interact with it. This gives LLMs the benefit of supplying them with functionality and context, without needing to read the entire codebase. In other words: less but higher-quality context.
Our prompt library notes the _api pattern so that LLMs are guided to the right information. If the LLM needs to manipulate a visit, it knows to look at the visit app's visit_api.py file for that functionality. Our next step is to create an LLM tool (MCP) for getting the outline of a file (just the function names and comments, as the bodies are redundant).
Investing in oversight
We need guidance and oversight. A 3-ton truck with a middle-schooler behind the wheel puts people in the hospital (and in jail). This is why the mentality of automating engineers is objectionable. We should be fostering our teams, not discarding them.
Remember, engineers operate on two timelines. As overseers of implementation, we must plan for the future of the codebase. If an LLM makes a choice, the overseer should be able to discern whether it was a good one or a bad one. For example, let's say the LLM opted to use Redis over Postgres to store some metadata. Was that a good choice? The overseer should know.
An investment in oversight is an investment in team, alignment, and workflows.
For team, it's worth investing in elevating everyone's design capabilities.
Design produces architecture. Architecture is a bet on the future. It's a bet that by setting up a program in a certain way, it will make the future feature development easier.
Architects are often created through experience. A career of shooting yourself in the foot builds intuition. This intuition shapes new software from having the same mistakes.
Aside: Some thoughts on how to grow design skills
Read books, blogs, and code. Watch conference talks. Replicate masterworks. Practice by writing programs that you don't know how to build.
On replicating masterworks:
1 Student artists are often required to replicate masterworks. A masterwork is an art piece that an expert artist made. Through the process of replicating this masterwork, an artist gains practical experience at the bleeding edge of art. (This experience also builds confidence, which is a bonus.)
2 The same is true for engineering. I've learned more by writing a programming language than I have in reading a hundred blog posts.
Why does this work?
1 You understand a layer of abstraction deeper than the layer you're working at (this is a Cantrill-ism, but I can't find the quote).
2 Masters use techniques and workflows that are best learned via practice. Thorsten Ball taught me how to break down large problems into tractable phases. Each phase had a contract and each contract could be tested.
On reading code:
1 A good way to expand your vocabulary of solutions.
2 In Steve Ruiz's V1 of TLDraw, I learned the patterns necessary to later implement session-based undo/redo for an internal tool at work.
3 Reading code from leaders in the field is also a good way to build taste.
Oversight is not only about architecture, but also temperament, alignment to values, and workflows. Operators need to be both technical and product experts. Without a deep understanding of the product, it's easy to accidentally build the wrong solution.
Automating oversight
Some design concerns can be checked programmatically.
Moving more implementation feedback from human to computer helps us improve the chance of one-shotting. Agents can get feedback directly from their environment (e.g., type errors).
Think of these as bumper rails. You can increase the likelihood of an LLM reaching the bowling pins by making it impossible to land in the gutter.
One way to do this is through writing safety checks. But what is safety? Safety is protecting your abstractions. Pierce's Types and Programming Languages has my favorite definition of safety:
Informally, though, safe languages can be defined as ones that make it impossible to shoot yourself in the foot while programming.
Refining this intuition a little, we could say that a safe language is one that protects its own abstractions.
Safety refers to the language's ability to guarantee the integrity of these abstractions and of higher-level abstractions introduced by the programmer using the definitional facilities of the language. For example, a language may provide arrays, with access and update operations, as an abstraction of the underlying memory. A programmer using this language then expects that an array can be changed only by using the update operation on it explicitly—and not, for example, by writing past the end of some other data structure.
We tend to write tests for business-logic but don't always write tests for architecture-logic. Some programming languages have facilities for this built in.
Example: This example builds off the previous one about API files.
1 Let's say you have the same _api abstraction in your codebase. An app represents a module with encapsulated logic. Interacting with an app happens through a single chokehold. You don't get to futz with the internals of an app directly.
2 Python doesn't give good controls for enforcing this pattern, so this is currently a convention for us. But there are no mechanisms for preventing abuse.
3 This is where automating oversight comes in. Encode your conventions as law. You do this by writing a program (script, lint rule, etc) to check that this convention is not broken.
4 This is straightforward in this case: 1) walk AST 2) read imports 3) throw error if an import from one app reaches into the internals of another ( from visit import logic.internal_file ).
Addressing verification
Design and implementation are only two pieces of a project's lifecycle. Verification, like code review or QA, are necessary for building quality software.
As the volume of work increases, our ability to ship that work becomes constrained by our ability to review it.
Here are some incomplete ideas for addressing the verification bottleneck:
1 Lowering the barrier of entry to perform manual QA (not needing a dev env).
2 Invest in a testing setup that makes it easy to express tests (including setting up tests, e.g., with test data creation) with minimal code.
3 Encode frequent PR feedback into documentation so that there is some level of PR review an LLM can reasonably do.
4 Security is baked in as defaults in the framework, not context.
That's it, for now
This was the third part of a series on LLMs in software engineering.
First we learned what LLMs and genetics have in common. (part 1) LLMs don't simply improve all facets of engineering. Understanding which areas LLMs do improve (part 2) is important for knowing how to focus our investments. (part 3)
Aside: Why are LLMs good at greenfield?
LLMs tend to do well in greenfield projects. Humans also tend to be most productive in greenfield development. Why?
1 There isn’t a preestablished context the LLM is working in. The quality of a given decision has lower stakes. You can’t be inconsistent if there are no existing patterns.
2 Consistency becomes important as software projects scale. Consistency enables modularity and modularity enables productivity. It’s hard to cut through 5 different feature sets to abstract out a common module, if all features are written differently.
3 "Modularity is an efficient way to build, since it relies on components that have already been tried and tested and permits the modification or replacement of one part more or less independently from the others."5
Or, in today's age, the generator's. ↩
Not being able to one-shot prevents adoption from many programmers. Programmers are disposed to seeing a worse solution and wanting to build their own. Oh, I can either pay $10/mo for a subscription to this SaaS tool, or I can build my own..? I choose to build my own, of course! (I am guilty of this). I think mentality partially explains the disparity between LLM skeptics and advocates. ↩
Technical strategy is another form of context you can include in a prompt library. Though, you do risk bloating the context with many words, some of which aren't directly applicable. ↩
This structure is motivated by this post and this video. If you are in the Django ecosystem, I recommend reviewing those. ↩
I can't help but make another software comparison to Phillip Ball's How Life Works: "Modularity: Life never has to start from scratch. Evolution works with what is already there, even if this means redirecting it to new ends. We might (with great caution!) compare it to an electronic engineer who uses preexisting circuit components like diodes and resistors, and standard circuit elements such as oscillators and memory units, to create new devices. Thus life possesses a modular structure. This is most obvious in the way large organisms like us are assemblies of cells, as well as sharing common structures such as hearts and eyes. Modularity is an efficient way to build, since it relies on components that have already been tried and tested and permits the modification or replacement of one part more or less independently from the others." ↩