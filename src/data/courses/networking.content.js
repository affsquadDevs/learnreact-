// Computer Networking — course content. Original explanations written for self-study; same schema as the other courses.
const content = {
  meta: {
    title: 'Computer Networking: From Cables to the Cloud',
    description:
      'A comprehensive, hands-on tour of how computers talk to each other, from physical signals and Ethernet frames up to DNS, HTTP/3, TLS 1.3 and the operations that keep modern networks fast and secure. Every concept is explained from first principles with diagrams, real CLI tools and exercises so you can build a complete mental model of the Internet.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── LEVEL 1 — FOUNDATIONS ───────────────────── */
    {
      level: 1,
      name: 'Foundations',
      focus: 'What a network is, the models we use to reason about it, and how data actually travels',
      accent: '#0ea5e9',
      soft: '#e3f5fd',
      topics: [
        {
          id: 'nw1-t0',
          name: 'What a network is',
          concepts: [
            {
              id: 'nw1-t0-c0',
              title: 'Nodes, links and the idea of a network',
              summary:
                'A network is two or more devices connected so they can exchange data. The devices are called nodes and the connections between them are called links.',
              explanation:
                'At its simplest a network is just things that can send messages to each other. Each thing that can send or receive data is a node — a laptop, a phone, a printer, a server, a router, even a smart lightbulb. The path that carries the data between nodes is a link, which can be a physical cable, a fibre strand, or a radio signal in the air. Networking is the set of agreements (called protocols) that let nodes find each other and exchange data reliably even when they were built by different vendors. The power of a network grows with its size: a single cable between two computers is useful, but billions of nodes interconnected becomes the Internet. Everything else in this course is built on this one idea of nodes connected by links following shared rules.',
              analogy:
                'Think of a city: buildings are nodes, roads are links, and traffic laws are the protocols that let everyone move without constant collisions.',
              keyPoints: [
                'A node is any device that can send or receive data on the network.',
                'A link is the connection (cable, fibre, or wireless) between nodes.',
                'Protocols are the shared rules that make communication possible across vendors.',
                'Networks gain value as more nodes connect to them.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  A[Laptop] --- S[Switch]',
                  '  B[Phone] --- S',
                  '  P[Printer] --- S',
                  '  S --- R[Router]',
                ],
                caption: 'Several nodes joined by links through a switch, which then connects onward to a router.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In networking terms, what is a node and what is a link?',
                  hint: 'One is a device, the other is the connection between devices.',
                  solution: {
                    explanation:
                      'A node is any device that can send or receive data (laptop, phone, router, server). A link is the connection that carries data between nodes, whether a cable, fibre, or wireless signal.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'List three nodes and the type of link each might use to reach a home router.',
                  solution: {
                    lines: [
                      'Desktop PC -> Ethernet cable',
                      'Smartphone -> WiFi radio link',
                      'Smart TV -> Ethernet or WiFi',
                    ],
                    explanation:
                      'Any device that exchanges data is a node; the link is whatever medium connects it to the router, wired or wireless.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Two computers have a perfect cable between them but run completely different, incompatible rules for formatting messages. Will they communicate?',
                  solution: {
                    explanation:
                      'No. A working link is necessary but not sufficient. Communication also requires shared protocols so each side can interpret the other\'s data. Without agreed rules the bits arrive but mean nothing.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-a-computer-network/',
            },
            {
              id: 'nw1-t0-c1',
              title: 'LAN, WAN and MAN: networks by size',
              summary:
                'Networks are categorised by geographic scope. A LAN covers a small area, a WAN spans large distances, and a MAN sits in between at city scale.',
              explanation:
                'A Local Area Network (LAN) connects devices in a single location such as a home, office floor or building. It is usually owned and managed by one organisation, uses fast local links like Ethernet and WiFi, and has very low latency. A Wide Area Network (WAN) connects LANs across long distances — between cities, countries or continents — typically using links leased from telecom carriers. The Internet itself is the largest WAN of all, a network of networks. A Metropolitan Area Network (MAN) is the middle ground, spanning a city or campus, often connecting an organisation\'s several buildings. The key differences are scale, who owns the infrastructure, and the trade-off between speed and distance: local links are fast and cheap, long-haul links are slower per hop and more expensive.',
              analogy:
                'A LAN is the rooms inside your house, a MAN is your neighbourhood, and a WAN is the highway system linking cities together.',
              keyPoints: [
                'LAN: single location, one owner, fast links like Ethernet and WiFi.',
                'WAN: spans large distances, usually over leased carrier links.',
                'MAN: city or campus scale, between LAN and WAN.',
                'The Internet is the worlds largest WAN, a network of networks.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  L1[Office LAN] --> M[City MAN]',
                  '  L2[Home LAN] --> M',
                  '  M --> W[Internet WAN]',
                  '  L3[Remote LAN] --> W',
                ],
                caption: 'Local networks join into city-scale and then global networks.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which category does the Internet fall into and why?',
                  hint: 'Think about the distance it spans.',
                  solution: {
                    explanation:
                      'The Internet is a WAN — in fact the largest one. It connects countless LANs and other networks across the entire globe, so it spans the widest possible area.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A company connects three buildings spread across one city into a single network. What is this most accurately called?',
                  solution: { explanation: 'A MAN (Metropolitan Area Network), because it spans a city or campus, larger than a LAN but smaller than a WAN.' },
                },
                {
                  type: 'predict',
                  prompt: 'Why is latency typically lower on a LAN than across a WAN?',
                  solution: {
                    explanation:
                      'LAN links are short and local, so signals travel a tiny distance through few devices. WAN traffic crosses many routers and long physical distances, each adding propagation and processing delay, so latency rises.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-a-lan/',
            },
            {
              id: 'nw1-t0-c2',
              title: 'Clients, servers and peer-to-peer',
              summary:
                'Most network communication follows a client-server model where one side requests and the other responds. An alternative is peer-to-peer, where nodes act as both.',
              explanation:
                'In the client-server model, a server is a node that offers a service and waits for requests, while a client is a node that initiates requests to use that service. Your browser is a client that asks a web server for a page; an email app is a client that asks a mail server for messages. Servers are usually always-on, well-provisioned machines, and a single server can handle many clients at once. The alternative is the peer-to-peer (P2P) model, where every node can act as both client and server, sharing resources directly with no central authority — file-sharing networks and some blockchains work this way. Client-server is easier to manage, secure and scale centrally, while P2P is more resilient because there is no single point of failure. The same physical machine can be a client in one exchange and a server in another; the roles describe behaviour during a given conversation, not fixed identities.',
              analogy:
                'Client-server is a restaurant: customers (clients) order and the kitchen (server) prepares. Peer-to-peer is a potluck dinner where everyone both brings food and eats.',
              keyPoints: [
                'Client initiates requests; server waits for and answers them.',
                'One server typically serves many clients simultaneously.',
                'Peer-to-peer nodes act as both client and server, with no central hub.',
                'Roles describe behaviour in a conversation, not permanent device types.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant C as Client',
                  '  participant S as Server',
                  '  C->>S: request page',
                  '  S->>C: response with data',
                ],
                caption: 'The client asks, the server answers — the heart of the client-server model.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the defining difference between a client and a server?',
                  hint: 'Who starts the conversation?',
                  solution: {
                    explanation:
                      'The client initiates the request; the server waits and responds. The roles are about behaviour in a given exchange, so one machine can be both at different times.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'In a pure peer-to-peer network, what happens if one node goes offline?',
                  solution: {
                    explanation:
                      'The network keeps working. Because there is no central server, other peers continue sharing resources; resilience is a key strength of P2P, though finding content can be harder without a central index.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Classify each as client or server behaviour: (a) a browser fetching a page, (b) a web server returning HTML, (c) a database answering a query.',
                  solution: {
                    lines: [
                      'a) client',
                      'b) server',
                      'c) server',
                    ],
                    explanation:
                      'The browser initiates so it is a client; the web server and database both wait for and answer requests, so they act as servers.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_web_server',
            },
            {
              id: 'nw1-t0-c3',
              title: 'The Internet versus the Web',
              summary:
                'The Internet is the global network infrastructure; the World Wide Web is just one service that runs on top of it. They are not the same thing.',
              explanation:
                'People use Internet and Web interchangeably, but they are different layers. The Internet is the physical and logical infrastructure: the cables, routers, addressing and protocols (chiefly the TCP/IP suite) that let any connected device exchange data with any other. The World Wide Web is one application built on the Internet — a system of interlinked documents and resources accessed over HTTP and identified by URLs, viewed in a browser. Many other services also run on the Internet without being part of the Web: email (SMTP, IMAP), file transfer (FTP, SFTP), video calls, online games, and software update systems. So the Web needs the Internet, but the Internet existed before the Web and would keep working without it. Understanding this separation makes it clear why fixing a website problem and fixing a connectivity problem are different tasks.',
              analogy:
                'The Internet is the road network; the Web is one company\'s delivery service that drives on those roads. Plenty of other vehicles use the same roads.',
              keyPoints: [
                'The Internet is the global infrastructure and protocols connecting all devices.',
                'The Web is one application on the Internet: documents over HTTP, viewed in a browser.',
                'Email, file transfer, video calls and games also run on the Internet but are not the Web.',
                'The Internet predates the Web and would function without it.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  I[Internet infrastructure] --> W[Web over HTTP]',
                  '  I --> E[Email]',
                  '  I --> F[File transfer]',
                  '  I --> G[Online games]',
                ],
                caption: 'The Web is just one of many services riding on the underlying Internet.',
              },
              commonMistakes: [
                'Saying the Internet and the Web are the same thing.',
                'Assuming all online activity happens in a browser.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Is email part of the World Wide Web?',
                  hint: 'Does email need a browser and HTTP to exist?',
                  solution: {
                    explanation:
                      'No. Email is a separate Internet service using protocols like SMTP and IMAP. You can read mail in a web app, but the underlying email system is not part of the Web itself.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which came first, the Internet or the Web?',
                  solution: { explanation: 'The Internet. The Web was invented later as one application running on top of the existing Internet infrastructure.' },
                },
                {
                  type: 'predict',
                  prompt: 'If every web server on Earth was switched off, could two computers still send each other files over the Internet?',
                  solution: {
                    explanation:
                      'Yes. The Web is only one service. The Internet infrastructure and other protocols (like file transfer) would still operate, so direct file exchange could continue.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work',
            },
          ],
        },
        {
          id: 'nw1-t1',
          name: 'Network models',
          concepts: [
            {
              id: 'nw1-t1-c0',
              title: 'Why we layer networks',
              summary:
                'Networking is split into layers so each one solves one problem and can change independently. Layering tames enormous complexity through separation of concerns.',
              explanation:
                'Moving a message from an app on one machine to an app on another involves dozens of distinct problems: turning bits into signals, addressing devices, finding a route, ensuring reliability, formatting data. Trying to solve all of these in one monolithic block would be unmanageable. Layering breaks the job into stacked levels, where each layer provides a service to the layer above and relies on the layer below, talking only through well-defined interfaces. This means you can swap WiFi for Ethernet at the bottom without changing your web browser at the top, because each layer hides its details from its neighbours. Layering also makes troubleshooting systematic: you can test each layer in turn. The two famous models that describe this are the OSI seven-layer model and the more practical TCP/IP four-layer model.',
              analogy:
                'Sending a parcel: you only write the address, the courier handles routing, planes handle transport, and conveyor belts handle movement. Each layer trusts the next without knowing how it works.',
              keyPoints: [
                'Layering splits networking into independent, single-purpose levels.',
                'Each layer serves the one above and uses the one below via fixed interfaces.',
                'You can change one layer without rewriting the others.',
                'Layering makes troubleshooting methodical, one layer at a time.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the main benefit of dividing networking into layers?',
                  hint: 'Think about changing one part without breaking others.',
                  solution: {
                    explanation:
                      'Separation of concerns: each layer solves one problem and exposes a fixed interface, so you can change or replace one layer (for example switch from WiFi to Ethernet) without affecting the rest.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why does swapping a wired connection for WiFi not require changing your web browser?',
                  solution: {
                    explanation:
                      'Because the physical and data-link layers are below the application layer. The browser uses the same interface to the layers below it regardless of the medium, so the lower-layer change is invisible to it.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Give one real example of a layer being changed without affecting the application above it.',
                  solution: {
                    lines: [
                      'Move a laptop from Ethernet to WiFi',
                      'A streaming video keeps playing',
                    ],
                    explanation:
                      'The link layer changed but the application layer (the video player) continued unaffected, demonstrating the independence layering provides.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/',
            },
            {
              id: 'nw1-t1-c1',
              title: 'The OSI seven-layer model',
              summary:
                'OSI is a conceptual model that divides networking into seven layers, from physical signals up to the application. It is the common vocabulary for discussing networks.',
              explanation:
                'The OSI model defines seven layers, each with a clear job. Layer 1 Physical moves raw bits as electrical, optical or radio signals. Layer 2 Data Link groups bits into frames and handles local delivery using hardware (MAC) addresses, as Ethernet and WiFi do. Layer 3 Network handles logical addressing and routing between networks, which is the job of IP. Layer 4 Transport provides end-to-end delivery between programs, with TCP and UDP and the concept of ports. Layer 5 Session manages and synchronises ongoing conversations. Layer 6 Presentation handles data format, encoding and encryption. Layer 7 Application is where network-aware programs and their protocols (like HTTP) live. A common memory aid from layer 1 up is Please Do Not Throw Sausage Pizza Away. In real life people most often reference layers 1 through 4 and 7, and they say things like a layer 3 device meaning a router.',
              analogy:
                'OSI is like the stages of mailing a letter: writing it, choosing wording, sealing it, addressing it, routing it, transporting it, and finally the postal wires that carry the truck along — each stage handled separately.',
              keyPoints: [
                'Seven layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
                'Layer 2 uses MAC addresses; layer 3 uses IP addresses; layer 4 uses ports.',
                'OSI is conceptual but gives everyone a shared vocabulary, like saying a layer 3 device.',
                'Engineers most commonly reference layers 1 to 4 and layer 7.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  L7[Application] --> L6[Presentation]',
                  '  L6 --> L5[Session]',
                  '  L5 --> L4[Transport]',
                  '  L4 --> L3[Network]',
                  '  L3 --> L2[Data Link]',
                  '  L2 --> L1[Physical]',
                ],
                caption: 'The seven OSI layers from the application at the top down to the physical medium.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which OSI layer is responsible for routing between different networks, and what addresses does it use?',
                  hint: 'It is the layer that IP lives at.',
                  solution: {
                    explanation:
                      'Layer 3, the Network layer, handles routing between networks using logical IP addresses. IP is the protocol that operates here.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'At which OSI layer do TCP and UDP operate, and what concept do they introduce to identify programs?',
                  solution: { explanation: 'Layer 4, the Transport layer. TCP and UDP introduce ports to identify which program on a host a message is for.' },
                },
                {
                  type: 'predict',
                  prompt: 'A switch forwards frames using MAC addresses. At which OSI layer does it primarily operate?',
                  solution: {
                    explanation:
                      'Layer 2, the Data Link layer, because MAC addresses and frames are layer 2 concepts. A plain switch is therefore called a layer 2 device.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/',
            },
            {
              id: 'nw1-t1-c2',
              title: 'The TCP/IP four-layer model',
              summary:
                'The TCP/IP model is the practical model the Internet actually runs on. It collapses the OSI layers into four: Link, Internet, Transport and Application.',
              explanation:
                'While OSI is the teaching reference, the Internet was built on the TCP/IP model, which is simpler and maps directly to real protocols. Its bottom Link layer (sometimes Network Access) covers OSI layers 1 and 2, handling the physical medium and local frame delivery, for example Ethernet and WiFi. The Internet layer corresponds to OSI layer 3 and is where IP lives, providing logical addressing and routing across networks. The Transport layer matches OSI layer 4, giving end-to-end delivery with TCP and UDP. The Application layer rolls OSI layers 5, 6 and 7 into one and is home to protocols like HTTP, DNS and SMTP. The key takeaway is that both models describe the same journey of data; OSI just slices it more finely. When people talk about the protocol stack of the Internet, they usually mean TCP/IP.',
              analogy:
                'OSI is a detailed seven-course tasting menu; TCP/IP is the same meal served as four practical plates. Same food, fewer dishes to wash.',
              keyPoints: [
                'Four layers: Link, Internet, Transport, Application.',
                'Link covers OSI 1 to 2; Internet equals OSI 3; Transport equals OSI 4; Application covers OSI 5 to 7.',
                'IP lives at the Internet layer; TCP and UDP at Transport; HTTP, DNS, SMTP at Application.',
                'TCP/IP is the model the real Internet runs on.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  A[Application HTTP DNS] --> T[Transport TCP UDP]',
                  '  T --> I[Internet IP]',
                  '  I --> L[Link Ethernet WiFi]',
                ],
                caption: 'The four TCP/IP layers with the main protocols that live at each.',
              },
              commonMistakes: [
                'Thinking OSI and TCP/IP are competing rather than two views of the same process.',
                'Forgetting that the TCP/IP Application layer absorbs OSI session and presentation duties.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which TCP/IP layer corresponds to OSI layers 5, 6 and 7 combined?',
                  hint: 'It is where HTTP and DNS live.',
                  solution: {
                    explanation:
                      'The Application layer. In TCP/IP it absorbs the OSI Session, Presentation and Application layers into a single layer.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Map these protocols to their TCP/IP layer: HTTP, IP, TCP, Ethernet.',
                  solution: {
                    lines: [
                      'HTTP -> Application',
                      'TCP -> Transport',
                      'IP -> Internet',
                      'Ethernet -> Link',
                    ],
                    explanation:
                      'Each protocol belongs to one TCP/IP layer, and together they form the stack a packet passes through.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'If a colleague says a problem is at the Internet layer of TCP/IP, what kind of issue are they pointing to?',
                  solution: {
                    explanation:
                      'An IP-level issue such as addressing or routing between networks, equivalent to OSI layer 3. They are not talking about cables (Link) or applications (Application).',
                  },
                },
              ],
              docs: 'https://www.rfc-editor.org/rfc/rfc1122',
            },
          ],
        },
        {
          id: 'nw1-t2',
          name: 'How data travels',
          concepts: [
            {
              id: 'nw1-t2-c0',
              title: 'Packets and frames',
              summary:
                'Data is not sent as one continuous stream but chopped into small chunks. At the network layer these chunks are packets; at the link layer they are frames.',
              explanation:
                'When you send a file or load a page, the data is split into many small pieces so it can share the network fairly and recover from errors. A packet is the unit at the network (IP) layer, carrying a chunk of data plus addressing information about where it is from and where it is going. As a packet moves over a specific physical link it is wrapped into a frame, the unit at the data-link layer, which adds local hardware addressing and an error check. Breaking data into pieces means many conversations can interleave on the same link, a lost piece can be resent without restarting everything, and each piece can take a different route. The receiving side collects the pieces and reassembles them in order. This chunking is fundamental to how packet-switched networks like the Internet work, in contrast to old circuit-switched phone lines that dedicated a whole path to one call.',
              analogy:
                'Mailing a long book by tearing out pages, putting each in its own numbered envelope, and letting the post office deliver them by whatever route. The reader reassembles them by number.',
              keyPoints: [
                'Data is split into small chunks rather than sent as one stream.',
                'A packet is the network-layer unit and carries IP addressing.',
                'A frame is the link-layer unit and carries local hardware addressing plus an error check.',
                'Chunking enables sharing, error recovery and flexible routing — packet switching.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  D[Big message] --> P1[Packet one]',
                  '  D --> P2[Packet two]',
                  '  D --> P3[Packet three]',
                  '  P1 --> N[Network]',
                  '  P2 --> N',
                  '  P3 --> N',
                ],
                caption: 'A large message is divided into many packets that travel the network independently.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between a packet and a frame?',
                  hint: 'Think about which layer each belongs to.',
                  solution: {
                    explanation:
                      'A packet is the network-layer (IP) unit carrying logical addressing; a frame is the link-layer unit that wraps a packet for transmission over one physical hop, adding hardware addressing and an error check.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why does splitting data into packets help when one piece is lost in transit?',
                  solution: {
                    explanation:
                      'Only the lost packet needs to be retransmitted, not the entire message. This makes recovery efficient and lets the rest of the data keep flowing.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How does packet switching differ from circuit switching?',
                  solution: {
                    explanation:
                      'Packet switching breaks data into independently routed chunks that share links, while circuit switching dedicates a fixed end-to-end path for the whole conversation. The Internet uses packet switching for efficiency and resilience.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-a-packet/',
            },
            {
              id: 'nw1-t2-c1',
              title: 'Encapsulation and headers',
              summary:
                'As data moves down the stack each layer wraps it with its own header. This nesting of headers around the payload is called encapsulation.',
              explanation:
                'Encapsulation is how the layered model becomes concrete. When an application sends data, it is handed down the stack and each layer adds a header (and sometimes a trailer) containing the control information that layer needs. The transport layer adds a header with source and destination ports; the network layer adds a header with source and destination IP addresses; the link layer adds a header with MAC addresses plus a trailing checksum. The original data plus everything wrapped around it is what travels on the wire. At the receiving end the reverse happens, called decapsulation: each layer reads and strips its own header before passing the inner payload up. A useful mental picture is nested envelopes, where each layer is an envelope addressed for its own purpose. Crucially, each layer only reads its own header and treats everything inside as an opaque payload, which is exactly what keeps the layers independent.',
              analogy:
                'A gift inside a box, inside wrapping paper, inside a shipping carton with a label. Each handler reads only the layer meant for them and ignores the rest.',
              keyPoints: [
                'Each layer adds its own header as data moves down the stack.',
                'Transport adds ports, network adds IP addresses, link adds MAC addresses and a checksum.',
                'Decapsulation reverses this on receipt, each layer stripping its own header.',
                'A layer treats the inner contents as opaque, preserving independence.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  A[App data] --> B[Add transport header ports]',
                  '  B --> C[Add network header IP]',
                  '  C --> D[Add link header MAC plus checksum]',
                  '  D --> E[Bits on the wire]',
                ],
                caption: 'Going down the stack, each layer wraps the data with its own header before transmission.',
              },
              code: {
                language: 'text',
                lines: [
                  '[ Ethernet header ][ IP header ][ TCP header ][ HTTP data ][ Ethernet trailer ]',
                  '   MAC addresses     IP addresses   port numbers   actual payload   error check',
                ],
                explanation: 'A simplified view of an encapsulated web request frame, outermost header first, showing what each layer contributes.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What information does the network-layer header add during encapsulation?',
                  hint: 'It is the layer where IP operates.',
                  solution: {
                    explanation:
                      'Source and destination IP addresses, which allow the packet to be routed across networks toward its destination.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'When a frame arrives at a host, in what order are the headers removed?',
                  solution: {
                    explanation:
                      'Outermost first: the link header, then the network header, then the transport header, finally exposing the application data. This is decapsulation, the reverse of how the headers were added.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'For a web request, name which header carries the port number and which carries the IP address.',
                  solution: {
                    lines: [
                      'Port number -> TCP transport header',
                      'IP address -> IP network header',
                    ],
                    explanation:
                      'Ports identify the program at the transport layer; IP addresses identify the host at the network layer.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
            },
            {
              id: 'nw1-t2-c2',
              title: 'Bandwidth, latency and throughput',
              summary:
                'These three measure different things. Bandwidth is capacity, latency is delay, and throughput is the real data rate you actually achieve.',
              explanation:
                'Bandwidth is the maximum amount of data a link could carry per unit of time, measured in bits per second, for example a 1 Gbps connection. It is the width of the pipe, not how fast a single bit travels. Latency is the time it takes a piece of data to get from source to destination, measured in milliseconds, and is dominated by physical distance, the number of hops, and any queuing. The round-trip time (RTT) is latency there and back, which is what ping measures. Throughput is the actual data rate you achieve in practice, which is usually lower than bandwidth because of latency, protocol overhead, congestion and packet loss. A high-bandwidth satellite link can still feel sluggish because its latency is huge. For interactive tasks like gaming and video calls latency matters most, while for bulk transfers like downloads bandwidth and throughput dominate. Keeping these terms distinct is essential when diagnosing why a network feels slow.',
              analogy:
                'A motorway: bandwidth is how many lanes it has, latency is how long your car takes to drive end to end, and throughput is how many cars actually arrive per minute given traffic.',
              keyPoints: [
                'Bandwidth is maximum capacity in bits per second, the width of the pipe.',
                'Latency is delay; round-trip time is latency there and back, measured by ping.',
                'Throughput is the real achieved rate, usually below bandwidth.',
                'Interactive tasks care about latency; bulk transfers care about bandwidth and throughput.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  S[Sender] -->|capacity is bandwidth| R[Receiver]',
                  '  S -->|delay is latency| R',
                  '  S -->|actual rate is throughput| R',
                ],
                caption: 'Three different properties of the same link: how wide, how slow, and how much really gets through.',
              },
              code: {
                language: 'bash',
                lines: [
                  'ping example.com',
                  '# 64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=18.2 ms',
                  '# the time value is the round-trip latency in milliseconds',
                ],
                explanation: 'ping sends small probes and reports the round-trip time, a direct measure of latency rather than bandwidth.',
              },
              commonMistakes: [
                'Assuming a high-bandwidth link is always fast — high latency can still make it feel slow.',
                'Confusing throughput with bandwidth; real throughput is almost always lower.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A satellite link advertises high bandwidth but feels slow for video calls. What property is the likely culprit?',
                  hint: 'Distance to orbit and back is enormous.',
                  solution: {
                    explanation:
                      'High latency. The signal must travel to a distant satellite and back, adding hundreds of milliseconds of delay, which ruins interactive calls even when bandwidth is plentiful.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Two links share the same 100 Mbps bandwidth, but one suffers heavy packet loss. How do their throughputs compare?',
                  solution: {
                    explanation:
                      'The lossy link will have lower throughput, because lost packets trigger retransmissions and congestion control backs off the sending rate, so less useful data actually gets through per second.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which networking tool directly measures round-trip latency, and in what unit?',
                  solution: { explanation: 'ping measures round-trip time, reported in milliseconds. It is the standard quick check for latency between two hosts.' },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/performance/glossary/what-is-latency/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 2 — THE LOWER LAYERS ───────────────────── */
    {
      level: 2,
      name: 'The Lower Layers',
      focus: 'Layers 1 to 3: signals and Ethernet, IP addressing and subnets, and how routers move packets',
      accent: '#0ea5e9',
      soft: '#e3f5fd',
      topics: [
        {
          id: 'nw2-t0',
          name: 'Physical and data link',
          concepts: [
            {
              id: 'nw2-t0-c0',
              title: 'Signals, media and the physical layer',
              summary:
                'The physical layer turns bits into signals that travel over a medium, whether copper, fibre or radio. It is the foundation everything else rides on.',
              explanation:
                'At the very bottom of the stack, the physical layer is concerned with moving raw ones and zeros across a medium. In copper Ethernet cables those bits become changing voltage levels; in fibre-optic cables they become pulses of light; in WiFi they become modulated radio waves. The physical layer defines the connectors, voltages, frequencies and timing that let the two ends agree on what a one and a zero look like. Different media have different strengths: copper is cheap and easy but limited in distance and prone to interference, fibre carries enormous bandwidth over long distances without electromagnetic interference, and wireless trades raw capacity for mobility and convenience. None of the smarter functions like addressing or routing exist here; this layer only cares about getting symbols from one end of a single link to the other. Errors and noise introduced here are why higher layers add checksums and retransmission.',
              analogy:
                'The physical layer is the vocal cords and air of speech — it produces the raw sound. Whether the sound means anything is somebody else\'s job.',
              keyPoints: [
                'The physical layer converts bits into signals: voltage, light or radio.',
                'It defines connectors, voltages, frequencies and timing.',
                'Copper is cheap, fibre is high-capacity and long-range, wireless adds mobility.',
                'It moves symbols over one link only, with no addressing or routing.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does a fibre-optic cable represent bits, compared with a copper cable?',
                  hint: 'One uses light, the other electricity.',
                  solution: {
                    explanation:
                      'Fibre represents bits as pulses of light, while copper represents them as changing voltage levels. Fibre offers more bandwidth over longer distances and is immune to electromagnetic interference.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why do higher layers bother with checksums if the physical layer already carries the bits?',
                  solution: {
                    explanation:
                      'Because the physical medium is imperfect: noise, interference and attenuation can flip bits. Higher layers add checksums and retransmission to detect and recover from those errors.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Match each medium to a key strength: copper, fibre, wireless.',
                  solution: {
                    lines: [
                      'copper -> cheap and simple',
                      'fibre -> high bandwidth over long distance',
                      'wireless -> mobility and no cabling',
                    ],
                    explanation:
                      'Each medium trades off cost, capacity, distance and convenience differently, which is why networks mix all three.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/',
            },
            {
              id: 'nw2-t0-c1',
              title: 'Ethernet, frames and MAC addresses',
              summary:
                'Ethernet is the dominant wired data-link technology. It packages data into frames and identifies devices by their burned-in MAC addresses.',
              explanation:
                'Ethernet operates at the data-link layer and is how most wired local networks move data. It wraps each network-layer packet in an Ethernet frame, which begins with a destination and source MAC address, contains the payload, and ends with a frame check sequence used to detect corruption. A MAC address is a 48-bit hardware identifier, written as six pairs of hexadecimal digits, that is assigned to a network interface, usually by the manufacturer. The first half identifies the vendor and the second half is unique to the device. MAC addresses are flat and local: they identify a device on a single link but are not used to route across the wider Internet, which is the job of IP addresses. When a frame arrives, a device checks whether the destination MAC matches its own (or is a broadcast) and either accepts or ignores it. WiFi uses the same MAC addressing scheme so the two technologies interoperate seamlessly at the link layer.',
              analogy:
                'A MAC address is like the serial number stamped on a specific phone, while an IP address is more like the phone number you dial. One identifies the hardware, the other helps deliver across the system.',
              keyPoints: [
                'Ethernet is the main wired data-link technology and uses frames.',
                'A frame holds destination and source MAC addresses, payload, and a check sequence.',
                'A MAC address is a 48-bit hardware identifier, usually factory-assigned.',
                'MAC addresses are local to a link; IP addresses handle routing across networks.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  A[Destination MAC] --> B[Source MAC]',
                  '  B --> C[Type field]',
                  '  C --> D[Payload packet]',
                  '  D --> E[Frame check sequence]',
                ],
                caption: 'The structure of an Ethernet frame from destination MAC through to the error check at the end.',
              },
              code: {
                language: 'bash',
                lines: [
                  'ip link show',
                  '# link/ether 3c:22:fb:1a:9d:4e brd ff:ff:ff:ff:ff:ff',
                  '# the link/ether value is the MAC address of the interface',
                ],
                explanation: 'Listing interfaces reveals each ones MAC address; the broadcast address ff repeated is used to reach every device on the link.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is a MAC address and how many bits is it?',
                  hint: 'It is a hardware identifier written in hex.',
                  solution: {
                    explanation:
                      'A MAC address is a 48-bit hardware identifier assigned to a network interface, usually by the manufacturer, and written as six hexadecimal pairs. It identifies a device on a local link.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A frame arrives whose destination MAC does not match the receiving interface and is not a broadcast. What happens?',
                  solution: {
                    explanation:
                      'The interface ignores the frame. Devices only accept frames addressed to their own MAC or to the broadcast address, which keeps the link efficient.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why can a MAC address not be used to deliver data across the whole Internet?',
                  solution: {
                    explanation:
                      'MAC addresses are flat and local to a single link, with no hierarchy for routing. Cross-network delivery needs hierarchical IP addresses that routers can use to choose a path.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Glossary/MAC_address',
            },
            {
              id: 'nw2-t0-c2',
              title: 'Switches, collision and broadcast domains',
              summary:
                'A switch forwards frames intelligently between devices on a LAN using MAC addresses, dividing the network into separate collision domains.',
              explanation:
                'Early networks used hubs, which blindly repeated every incoming signal out of all ports, so every device shared one collision domain and only one could transmit at a time without garbling. A switch is much smarter: it learns which MAC address lives on which port by watching traffic, builds a MAC address table, and then forwards each frame only out of the correct port. This gives every port its own collision domain, so devices can transmit simultaneously without interfering, dramatically improving performance. A switch still floods broadcast frames (those addressed to everyone) out of all ports, so all devices on a switch share one broadcast domain by default. Separating broadcast domains requires either a router or virtual LANs (VLANs). Understanding these two domain types explains a lot about LAN behaviour: collisions are about who can transmit at once, broadcasts are about who hears a message meant for all.',
              analogy:
                'A hub is a person shouting in a room so everyone hears and must wait their turn. A switch is a receptionist who quietly hands each message to exactly the right person.',
              keyPoints: [
                'A switch learns MAC addresses and forwards frames only to the correct port.',
                'Each switch port is its own collision domain, allowing simultaneous transmission.',
                'All ports on a switch share one broadcast domain by default.',
                'Routers or VLANs are needed to separate broadcast domains.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  PC1[PC one] --> SW[Switch]',
                  '  PC2[PC two] --> SW',
                  '  PC3[PC three] --> SW',
                  '  SW --> R[Router separates broadcast domains]',
                ],
                caption: 'A switch gives each device its own collision domain; a router is needed to split broadcast domains.',
              },
              commonMistakes: [
                'Believing a switch separates broadcast domains — by default it does not.',
                'Confusing collision domains (who transmits) with broadcast domains (who hears all).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does a switch improve on a hub?',
                  hint: 'Think about where each forwards frames.',
                  solution: {
                    explanation:
                      'A switch learns MAC addresses and forwards each frame only to the destination port, giving every port its own collision domain. A hub repeats everything everywhere, forcing all devices to share one collision domain.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Ten PCs connect to one switch with no VLANs. How many broadcast domains exist?',
                  solution: {
                    explanation:
                      'One. A plain switch keeps all ports in a single broadcast domain, so a broadcast frame reaches all ten PCs. Splitting them would require a router or VLANs.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Name the two devices or features that can split a broadcast domain.',
                  solution: {
                    lines: [
                      'Router',
                      'VLAN configuration on a switch',
                    ],
                    explanation:
                      'Routers naturally bound broadcast domains, and VLANs logically partition a single switch into multiple broadcast domains.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-a-network-switch/',
            },
            {
              id: 'nw2-t0-c3',
              title: 'ARP: mapping IP to MAC',
              summary:
                'ARP, the Address Resolution Protocol, finds the MAC address that goes with a known IP address on the local network so a frame can be delivered.',
              explanation:
                'When a device wants to send data to another device on the same local network, it knows the destination IP address but the link layer needs a MAC address to build the frame. ARP bridges this gap. The sender broadcasts an ARP request on the local link asking who has this IP address, and the device that owns that IP replies directly with its MAC address. The sender caches the result in an ARP table so it does not have to ask again for a while. If the destination is on a different network, ARP is instead used to find the MAC address of the default gateway (the router), because that is where the frame must go first. ARP only works within a single broadcast domain since it relies on broadcasts. It is also a classic security weak spot: because replies are trusted without verification, an attacker can send forged ARP replies to redirect traffic, a technique called ARP spoofing.',
              analogy:
                'You know someone\'s name (IP) but not where they sit. You shout across the open-plan office asking, and the right person raises a hand and tells you their desk number (MAC).',
              keyPoints: [
                'ARP resolves a known IP address to the MAC address on the local link.',
                'The request is a broadcast; the owner of the IP replies with its MAC.',
                'Results are cached in an ARP table to avoid repeated lookups.',
                'For remote destinations, ARP finds the MAC of the default gateway.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant A as Sender',
                  '  participant N as All on LAN',
                  '  participant B as Target',
                  '  A->>N: who has this IP',
                  '  B->>A: that is me here is my MAC',
                ],
                caption: 'ARP broadcasts a question to the whole link and the owning device answers with its hardware address.',
              },
              code: {
                language: 'bash',
                lines: [
                  'arp -a',
                  '# router gateway at 192 dot 168 maps to 3c:22:fb:1a:9d:4e',
                  '# the command prints the cached IP to MAC mappings',
                ],
                explanation: 'The arp command shows the local ARP cache, each line pairing a known IP with the MAC address learned for it.',
              },
              commonMistakes: [
                'Thinking ARP works across the Internet — it is confined to the local broadcast domain.',
                'Forgetting that ARP replies are unauthenticated, which enables ARP spoofing.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What problem does ARP solve?',
                  hint: 'You have an IP but need something the link layer understands.',
                  solution: {
                    explanation:
                      'It maps a known IP address to the MAC address of the device on the local link, so the sender can build a frame that the data-link layer can actually deliver.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A host wants to reach an IP on a different network. Whose MAC does ARP resolve?',
                  solution: {
                    explanation:
                      'The default gateway (router) MAC. The frame is sent to the router, which then forwards the packet onward; ARP only resolves addresses within the local link.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is ARP vulnerable to spoofing?',
                  solution: {
                    explanation:
                      'ARP replies are accepted without authentication, so an attacker can forge a reply claiming to own an IP and redirect traffic through their machine, enabling man-in-the-middle attacks.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/ddos/glossary/address-resolution-protocol-arp/',
            },
          ],
        },
        {
          id: 'nw2-t1',
          name: 'IP addressing',
          concepts: [
            {
              id: 'nw2-t1-c0',
              title: 'IPv4 structure and notation',
              summary:
                'An IPv4 address is a 32-bit number written as four decimal octets. It identifies a host on a network and is split into a network part and a host part.',
              explanation:
                'IPv4 addresses are 32 bits long, conventionally written as four decimal numbers from 0 to 255 separated by dots, such as four octets each representing eight bits. That gives about 4.3 billion possible addresses, which once seemed plenty but is now exhausted, driving the move to IPv6 and the heavy use of private addressing with NAT. Every IPv4 address has two conceptual halves: a network portion that identifies which network the host belongs to, and a host portion that identifies the specific device on that network. The boundary between the two is set by the subnet mask, not by the address alone. Routers care about the network portion to decide where to send a packet, while the host portion only matters once the packet has reached the right network. Some address ranges are reserved for special uses, such as loopback for a device to talk to itself and private ranges for internal networks.',
              analogy:
                'An IP address is like a postal address where the first part is the city and street (the network) and the last part is the specific house number (the host).',
              keyPoints: [
                'IPv4 is 32 bits, written as four decimal octets from 0 to 255.',
                'There are about 4.3 billion IPv4 addresses, now effectively exhausted.',
                'Each address has a network portion and a host portion.',
                'The subnet mask defines where the network part ends and the host part begins.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'ip addr show',
                  '# inet shows the address with a slash and prefix length',
                  '# the prefix length tells you how many bits are the network part',
                ],
                explanation: 'Listing addresses shows each IPv4 assignment with its prefix length, which encodes how the address splits into network and host parts.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How many bits is an IPv4 address, and how is it usually written?',
                  hint: 'Four numbers separated by dots.',
                  solution: {
                    explanation:
                      'An IPv4 address is 32 bits, written as four decimal octets (each 0 to 255) separated by dots, for a total of about 4.3 billion possible addresses.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Two hosts share the same network portion but differ in their host portion. Are they on the same network?',
                  solution: {
                    explanation:
                      'Yes. Matching network portions (as determined by the subnet mask) means they are on the same network and can communicate directly without a router.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What determines where the network part of an IPv4 address ends?',
                  solution: { explanation: 'The subnet mask. The address alone does not say; the mask marks how many leading bits are the network portion.' },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-an-ip-address/',
            },
            {
              id: 'nw2-t1-c1',
              title: 'Public versus private addresses and NAT',
              summary:
                'Private IP ranges are reserved for internal networks and are not routable on the Internet. NAT lets many private hosts share one public address.',
              explanation:
                'Because IPv4 addresses are scarce, specific ranges were set aside as private and reserved for use inside home and corporate networks. These private addresses are not unique globally and routers on the Internet will not forward them, so the same private range can be reused in millions of homes. To let private hosts reach the Internet, a router performs Network Address Translation (NAT). When an internal device sends a packet outward, the router rewrites the source address to its own single public address and remembers the mapping, including the port numbers, in a translation table. Replies come back to the public address, and the router uses the table to rewrite them back to the correct internal host. This conserves public addresses dramatically, since one public address can front a whole network. It also acts as a rough boundary, because unsolicited inbound connections have no mapping and are dropped by default, though NAT was never designed as a security feature.',
              analogy:
                'NAT is like a company switchboard with one public phone number. Outside callers reach the switchboard, which routes each call to the right internal extension and back.',
              keyPoints: [
                'Private IP ranges are reserved for internal use and are not routed on the Internet.',
                'The same private range can be reused in countless separate networks.',
                'NAT rewrites internal source addresses to a shared public address and tracks the mapping.',
                'NAT conserves public addresses and incidentally blocks unsolicited inbound traffic.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  H1[Private host one] --> NAT[NAT router]',
                  '  H2[Private host two] --> NAT',
                  '  NAT -->|one public address| INET[Internet]',
                ],
                caption: 'Many private hosts share a single public address through NAT on the router.',
              },
              commonMistakes: [
                'Treating NAT as a real security mechanism rather than a side effect.',
                'Assuming private addresses are unique worldwide — they are deliberately reusable.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why can the same private IP range appear in millions of different homes?',
                  hint: 'Are private addresses routed on the Internet?',
                  solution: {
                    explanation:
                      'Private addresses are not routable on the public Internet, so they only need to be unique within each local network. Different networks can reuse the same ranges freely because they never collide on the Internet.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'An external host tries to open a connection to a device behind NAT with no port forwarding. What happens?',
                  solution: {
                    explanation:
                      'The router drops it, because there is no existing translation entry for an unsolicited inbound connection. This is why NAT appears to provide some protection, though it is not a designed security feature.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does a NAT router rewrite when an internal packet heads to the Internet?',
                  solution: { explanation: 'It rewrites the source IP address (and tracks ports) from the private address to the routers public address, recording the mapping so replies can be returned correctly.' },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-nat/',
            },
            {
              id: 'nw2-t1-c2',
              title: 'Subnets, subnet masks and CIDR',
              summary:
                'Subnetting splits a network into smaller pieces. The subnet mask or CIDR prefix marks which bits are the network part, defining the size of each subnet.',
              explanation:
                'A subnet is a logical subdivision of an IP network. Splitting a large network into subnets improves organisation, limits broadcast traffic, and tightens security boundaries. The subnet mask is a 32-bit value where the leading one-bits mark the network portion and the trailing zero-bits mark the host portion. Modern notation uses CIDR (Classless Inter-Domain Routing), writing the address followed by a slash and the number of network bits, so a slash twenty-four means the first twenty-four bits are the network and the remaining eight identify hosts. The number of host bits determines how many addresses a subnet holds: with eight host bits you get 256 total addresses, but two are reserved, the network address and the broadcast address, leaving 254 usable. Fewer host bits means smaller subnets and more of them. Devices use the mask to decide whether a destination is local (same subnet, send directly) or remote (different subnet, send to the gateway).',
              analogy:
                'A subnet mask is like deciding how many digits of a phone number are the area code. More digits reserved for the area code means more, smaller regions.',
              keyPoints: [
                'A subnet is a logical division of a network for organisation and control.',
                'The subnet mask marks network bits as ones and host bits as zeros.',
                'CIDR notation writes the prefix length after a slash, like slash twenty-four.',
                'In each subnet two addresses are reserved: the network and broadcast addresses.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  N[Large network] --> S1[Subnet A]',
                  '  N --> S2[Subnet B]',
                  '  N --> S3[Subnet C]',
                  '  S1 --> H[Hosts limited per subnet]',
                ],
                caption: 'One large address block carved into smaller subnets, each holding a limited number of hosts.',
              },
              code: {
                language: 'text',
                lines: [
                  'prefix slash twenty-four -> 24 network bits, 8 host bits',
                  '8 host bits -> 256 total addresses',
                  '256 minus network and broadcast -> 254 usable hosts',
                ],
                explanation: 'A worked example showing how a CIDR prefix translates into the number of usable host addresses in a subnet.',
              },
              commonMistakes: [
                'Forgetting that two addresses per subnet (network and broadcast) are not usable for hosts.',
                'Confusing more host bits (bigger subnet) with a larger prefix number (smaller subnet).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In CIDR, what does the number after the slash represent?',
                  hint: 'It counts a particular kind of bit.',
                  solution: {
                    explanation:
                      'It is the number of leading bits that form the network portion (the prefix length). The remaining bits are the host portion that distinguishes devices within the subnet.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'A subnet has 8 host bits. How many addresses total and how many are usable for hosts?',
                  solution: {
                    lines: [
                      'Total addresses -> 256',
                      'Reserved -> network and broadcast',
                      'Usable for hosts -> 254',
                    ],
                    explanation:
                      'Two to the power of the host bits gives the total; subtracting the network and broadcast addresses leaves the usable host count.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A host compares a destination address against its subnet mask and finds the network bits differ. What does it do with the packet?',
                  solution: {
                    explanation:
                      'It sends the packet to its default gateway, because a differing network portion means the destination is on a remote subnet that must be reached through a router.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/',
            },
            {
              id: 'nw2-t1-c3',
              title: 'Introducing IPv6',
              summary:
                'IPv6 is the successor to IPv4, using 128-bit addresses to provide a practically unlimited supply and simplifying parts of how addressing works.',
              explanation:
                'IPv6 was created because IPv4 ran out of addresses. Instead of 32 bits it uses 128 bits, written as eight groups of four hexadecimal digits separated by colons, which yields an almost incomprehensibly large address space, enough for every device imaginable. To keep addresses readable, leading zeros in a group can be dropped and one run of all-zero groups can be compressed to a double colon. IPv6 was designed with lessons from IPv4: it has no broadcast (using multicast instead), supports automatic address configuration so devices can self-assign addresses without a server, and removes the need for NAT because addresses are plentiful. IPv4 and IPv6 do not interoperate directly, so for a long transition period both run side by side in what is called dual stack. While IPv6 adoption is steadily rising, much of the Internet still relies on IPv4 with NAT, so understanding both remains essential.',
              analogy:
                'If IPv4 is a phone numbering plan running out of numbers in a growing country, IPv6 is switching to far longer numbers so every person and gadget can have their own forever.',
              keyPoints: [
                'IPv6 addresses are 128 bits, written as hex groups separated by colons.',
                'The address space is vast, ending IPv4 exhaustion concerns.',
                'IPv6 drops broadcast, supports autoconfiguration and removes the need for NAT.',
                'Dual stack runs IPv4 and IPv6 together during the long transition.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  V4[IPv4 32 bits] --> P[Address exhaustion]',
                  '  P --> V6[IPv6 128 bits]',
                  '  V6 --> D[Dual stack transition]',
                ],
                caption: 'Address exhaustion drove the move from 32-bit IPv4 to 128-bit IPv6, deployed alongside it during transition.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How many bits is an IPv6 address and how is it written?',
                  hint: 'Far longer than IPv4, and in hexadecimal.',
                  solution: {
                    explanation:
                      'IPv6 addresses are 128 bits, written as eight groups of four hexadecimal digits separated by colons, with leading zeros and one run of zero groups allowed to be compressed.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name one feature IPv6 has that IPv4 lacks.',
                  solution: {
                    explanation:
                      'Examples include a vastly larger address space, no broadcast (multicast instead), built-in stateless address autoconfiguration, and no need for NAT. Any one of these is correct.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why must many networks run both IPv4 and IPv6 at the same time?',
                  solution: {
                    explanation:
                      'Because the two protocols do not interoperate directly and much of the Internet is still IPv4. Running dual stack lets a host reach both IPv4 and IPv6 destinations during the transition.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-ipv6/',
            },
          ],
        },
        {
          id: 'nw2-t2',
          name: 'Routing',
          concepts: [
            {
              id: 'nw2-t2-c0',
              title: 'Routers and the default gateway',
              summary:
                'A router connects different networks and forwards packets between them. The default gateway is the router a host uses to reach anything outside its own subnet.',
              explanation:
                'A router is a layer 3 device whose job is to move packets between separate networks, making forwarding decisions based on the destination IP address. Where a switch works within one network using MAC addresses, a router sits at the boundary between networks and chooses which next hop gets a packet closer to its destination. Every host is configured with a default gateway, the IP address of the router it should send packets to when the destination is not on its own subnet. When you load a website, your computer sees the destination is remote, so it frames the packet for the gateway MAC and hands it off; the router then forwards it onward, and the process repeats router by router across the Internet. Each router strips the old link-layer frame and builds a new one for the next hop, while the IP packet itself is preserved end to end. This is why the IP address is the consistent identity of a packet, while MAC addresses change at every hop.',
              analogy:
                'The default gateway is your local post office. You don\'t need to know the whole route to a distant city; you just hand your letter to the post office and trust the system to relay it.',
              keyPoints: [
                'A router forwards packets between separate networks using destination IP.',
                'The default gateway is the router a host uses for off-subnet traffic.',
                'Each hop rebuilds the link-layer frame but preserves the IP packet.',
                'MAC addresses change hop by hop; the IP addresses stay the same end to end.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  H[Host] --> GW[Default gateway router]',
                  '  GW --> R2[Next router]',
                  '  R2 --> R3[Another router]',
                  '  R3 --> D[Destination network]',
                ],
                caption: 'A packet leaves via the default gateway and is forwarded router by router toward its destination network.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the default gateway used for?',
                  hint: 'Where do off-subnet packets go first?',
                  solution: {
                    explanation:
                      'It is the router a host sends packets to whenever the destination is not on the hosts own subnet, so it is the exit point toward the rest of the Internet.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'As a packet crosses several routers, what changes at each hop and what stays the same?',
                  solution: {
                    explanation:
                      'The link-layer frame and its MAC addresses are rebuilt at every hop, but the IP packet with its source and destination IP addresses is preserved end to end.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What kind of address does a router use to make forwarding decisions?',
                  solution: { explanation: 'The destination IP address (layer 3). A router is a layer 3 device, unlike a switch which forwards by MAC address at layer 2.' },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-a-router/',
            },
            {
              id: 'nw2-t2-c1',
              title: 'Routing tables and how a packet crosses the Internet',
              summary:
                'A router decides where to send each packet by consulting its routing table, which lists known networks and the next hop toward each.',
              explanation:
                'A routing table is the set of rules a router uses to forward packets. Each entry maps a destination network (as a CIDR prefix) to a next hop, the neighbouring router or interface that moves the packet closer. When a packet arrives, the router finds the most specific matching prefix, called the longest prefix match, and forwards the packet accordingly. A special catch-all entry, the default route, handles any destination not matched by a more specific entry, which is how routers without full knowledge of the Internet still send unknown traffic upstream. Crossing the Internet is this process repeated: each router along the path makes an independent, local decision based on its own table, and there is no single router that knows the whole route. The time-to-live (TTL) field in each packet is decremented at every hop and the packet is discarded if it reaches zero, which prevents packets from looping forever and is exactly what traceroute exploits to map a path.',
              analogy:
                'Each router is like a signpost at a junction pointing only to the next junction. No single signpost knows the full route, but follow them one by one and you arrive.',
              keyPoints: [
                'A routing table maps destination prefixes to next hops.',
                'Routers use longest prefix match to pick the most specific route.',
                'The default route is the catch-all for unmatched destinations.',
                'TTL decrements per hop and stops packets looping forever.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  P[Incoming packet] --> M[Longest prefix match]',
                  '  M --> H[Next hop chosen]',
                  '  M --> DF[Default route if no match]',
                  '  H --> O[Forward out interface]',
                ],
                caption: 'A router matches the destination against its table and forwards to the chosen next hop, or the default route if nothing else matches.',
              },
              code: {
                language: 'bash',
                lines: [
                  'ip route',
                  '# default via gateway dev eth0',
                  '# the default entry catches any destination with no specific route',
                ],
                explanation: 'The route table shows the default route plus any specific networks; the default line is the catch-all used when nothing more specific matches.',
              },
              commonMistakes: [
                'Assuming one device knows the entire path across the Internet.',
                'Overlooking TTL, which is what stops misrouted packets from circulating forever.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'When multiple routing-table entries match a destination, which one is used?',
                  hint: 'The most specific wins.',
                  solution: {
                    explanation:
                      'The longest prefix match, meaning the entry with the most specific (longest) matching network prefix. The default route is only used when nothing more specific matches.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A packet gets caught in a routing loop. What eventually stops it circulating?',
                  solution: {
                    explanation:
                      'Its TTL field decrements at each hop and when it reaches zero the packet is discarded. This guarantees looping packets eventually die rather than congesting the network forever.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Describe at a high level how a packet gets from your laptop to a distant web server.',
                  solution: {
                    lines: [
                      'Laptop sends to default gateway',
                      'Each router matches its table and forwards to a next hop',
                      'TTL drops each hop to prevent loops',
                      'Packet arrives at the destination network',
                    ],
                    explanation:
                      'No single router knows the full path; each makes an independent forwarding decision until the packet reaches its destination.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-routing/',
            },
            {
              id: 'nw2-t2-c2',
              title: 'Static versus dynamic routing',
              summary:
                'Routes can be configured by hand (static) or learned automatically by routers exchanging information (dynamic). Each suits different situations.',
              explanation:
                'Static routing means an administrator manually enters routes into a routers table. It is simple, predictable and uses no extra bandwidth or processing, which makes it ideal for small or stable networks and for default routes. Its weakness is that it does not adapt: if a link fails, a static route keeps pointing at the dead path until someone fixes it. Dynamic routing solves this by having routers run routing protocols that exchange reachability information and recompute paths automatically when the topology changes. Interior protocols like OSPF run within one organisation, while BGP is the protocol that stitches the entire Internet together by exchanging routes between independent networks called autonomous systems. Dynamic routing scales to huge, changing networks and recovers from failures on its own, at the cost of more complexity and overhead. Real networks often mix both: dynamic routing for the bulk of the work and a static default route as a simple fallback.',
              analogy:
                'Static routing is a printed map that never updates. Dynamic routing is a live navigation app that reroutes around a new road closure automatically.',
              keyPoints: [
                'Static routing is manually configured: simple, predictable, but does not adapt.',
                'Dynamic routing learns and updates routes automatically via routing protocols.',
                'OSPF is a common interior protocol; BGP connects the whole Internet.',
                'Many networks combine dynamic routing with a static default route.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  S[Static routing] --> ManualEntry[Admin sets routes by hand]',
                  '  D[Dynamic routing] --> Protocols[Routers exchange updates]',
                  '  Protocols --> Adapt[Reroutes on failure]',
                ],
                caption: 'Static routes are set by hand, while dynamic routing protocols let routers learn and adapt automatically.',
              },
              commonMistakes: [
                'Using only static routes in a large or changing network, where failures go unhandled.',
                'Thinking BGP and OSPF are interchangeable — BGP runs between organisations, OSPF within one.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the main drawback of static routing?',
                  hint: 'Think about what happens when a link goes down.',
                  solution: {
                    explanation:
                      'It does not adapt. If a link fails or the topology changes, a static route keeps pointing at the broken path until an administrator manually updates it.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which routing protocol is responsible for connecting the independent networks that make up the Internet?',
                  solution: { explanation: 'BGP (Border Gateway Protocol). It exchanges routes between autonomous systems, while protocols like OSPF operate within a single organisation.' },
                },
                {
                  type: 'predict',
                  prompt: 'A large enterprise wants its network to recover automatically from link failures. Should it rely on static routing?',
                  solution: {
                    explanation:
                      'No. It should use dynamic routing, which automatically recomputes paths when links fail. Static routing alone would leave failed routes broken until manually corrected.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-routing/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 3 — TRANSPORT AND CORE SERVICES ───────────────────── */
    {
      level: 3,
      name: 'Transport and Core Services',
      focus: 'TCP and UDP, the DNS that names the Internet, and how devices get their addresses with DHCP',
      accent: '#0ea5e9',
      soft: '#e3f5fd',
      topics: [
        {
          id: 'nw3-t0',
          name: 'TCP versus UDP',
          concepts: [
            {
              id: 'nw3-t0-c0',
              title: 'Ports and sockets',
              summary:
                'A port number identifies which program on a host a message is for. An IP address plus a port plus a protocol forms a socket, the endpoint of a connection.',
              explanation:
                'A single host runs many networked programs at once: a web browser, an email client, a music streamer. The IP address gets a packet to the right machine, but the transport layer needs to know which program should receive it, and that is the job of port numbers. A port is a 16-bit number, so there are 65536 of them. Well-known ports below 1024 are reserved for standard services, such as port 80 for HTTP and port 443 for HTTPS, while clients pick a random high-numbered ephemeral port for each outgoing connection. The combination of IP address, port and transport protocol identifies one end of a communication and is called a socket. A connection is fully described by the pair of sockets at each end, which is why one server on one port can hold many simultaneous connections: each client uses a different source port, so each connection is a distinct four-part combination. Understanding ports is the key to reasoning about which service traffic belongs to and to configuring firewalls.',
              analogy:
                'The IP address is the street address of an apartment building, and the port is the specific apartment number. Mail reaches the building by address and the right flat by number.',
              keyPoints: [
                'A port is a 16-bit number identifying a program on a host.',
                'Well-known ports below 1024 map to standard services, like 443 for HTTPS.',
                'A socket is an IP address plus a port plus a transport protocol.',
                'A connection is the unique pair of sockets at each end.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  C[Client random high port] --> S[Server port 443]',
                  '  C2[Another client] --> S',
                  '  S --> APP[Web service]',
                ],
                caption: 'Many clients reach one server port; each connection is distinguished by the clients unique source port.',
              },
              code: {
                language: 'bash',
                lines: [
                  'ss -tn',
                  '# shows established TCP connections with local and remote address and port',
                  '# each line is one socket pair identifying a connection',
                ],
                explanation: 'The ss tool lists active sockets; each row pairs a local and remote address and port, which together identify a single connection.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What three things make up a socket?',
                  hint: 'One is the machine, one is the program, one is the transport protocol.',
                  solution: {
                    explanation:
                      'An IP address (which host), a port number (which program), and a transport protocol (TCP or UDP). Together they identify one endpoint of a connection.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which port is the standard for HTTPS?',
                  solution: { explanation: 'Port 443. Plain HTTP uses port 80; HTTPS (HTTP over TLS) uses port 443 by convention.' },
                },
                {
                  type: 'predict',
                  prompt: 'How can one web server on a single port serve thousands of clients at once?',
                  solution: {
                    explanation:
                      'Each client connects from a different source IP and ephemeral port, so every connection is a unique four-part combination of source and destination sockets, letting the server keep them all distinct.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Glossary/Port',
            },
            {
              id: 'nw3-t0-c1',
              title: 'The TCP three-way handshake',
              summary:
                'TCP establishes a connection with a three-step exchange called the handshake, synchronising both sides before any data flows.',
              explanation:
                'TCP is connection-oriented, meaning both ends agree to communicate before sending data. They do this with the three-way handshake. First the client sends a SYN segment proposing a connection and an initial sequence number. The server replies with a SYN-ACK, acknowledging the client and proposing its own sequence number. Finally the client sends an ACK confirming the server, and the connection is now established in both directions. This exchange synchronises the sequence numbers each side will use to track bytes, which underpins TCP reliability and ordering. The handshake costs one round trip before the first byte of real data, which is why latency matters so much for short connections and why protocols layered on TCP, like older HTTPS, can feel slow over long distances. Closing a connection uses a similar but separate exchange of FIN and ACK segments. Knowing the handshake helps you read packet captures and understand connection-setup delays.',
              analogy:
                'It is like a phone call greeting: one says hello, the other says hello can you hear me, the first says yes I can — only then does the real conversation begin.',
              keyPoints: [
                'TCP is connection-oriented and sets up before sending data.',
                'The handshake is three steps: SYN, then SYN-ACK, then ACK.',
                'It synchronises sequence numbers used for reliability and ordering.',
                'Setup costs one round trip, so latency hurts short connections.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant C as Client',
                  '  participant S as Server',
                  '  C->>S: SYN',
                  '  S->>C: SYN ACK',
                  '  C->>S: ACK',
                ],
                caption: 'The three-way handshake establishes a TCP connection before any application data is exchanged.',
              },
              commonMistakes: [
                'Forgetting the handshake adds a full round trip before data flows.',
                'Confusing connection setup (SYN handshake) with connection teardown (FIN exchange).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'List the three messages of the TCP handshake in order.',
                  hint: 'It is named for the number of steps.',
                  solution: {
                    explanation:
                      'SYN from the client, SYN-ACK from the server, then ACK from the client. After the third message the connection is established in both directions.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why does a TCP connection over a high-latency link feel slow to start even with high bandwidth?',
                  solution: {
                    explanation:
                      'Because the handshake requires a full round trip before any data can be sent, and high latency makes that round trip slow regardless of bandwidth. Each extra setup round trip compounds the delay.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What do the sequence numbers exchanged during the handshake enable?',
                  solution: { explanation: 'They let TCP track which bytes have been sent and received, providing reliable, in-order delivery through acknowledgements and retransmission.' },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/',
            },
            {
              id: 'nw3-t0-c2',
              title: 'Reliability, ordering and flow control in TCP',
              summary:
                'TCP guarantees that data arrives complete, in order and without overwhelming the receiver, using acknowledgements, sequencing, retransmission and windows.',
              explanation:
                'TCP turns the unreliable, unordered packet delivery of IP into a dependable byte stream. It numbers every byte with sequence numbers, so the receiver can reassemble segments in the correct order even if they arrive out of sequence. The receiver sends acknowledgements (ACKs) for data it has received, and if the sender does not get an ACK in time it retransmits the missing data, which is how loss is repaired. Flow control prevents a fast sender from overwhelming a slow receiver: the receiver advertises a window indicating how much data it can currently buffer, and the sender never exceeds it. Separately, congestion control makes TCP back off when the network itself is overloaded, probing for available capacity and slowing down when it detects loss. These mechanisms together are why TCP is the right choice for web pages, file transfers and email, where every byte must arrive correctly, even though they add overhead and delay compared with sending data blindly.',
              analogy:
                'TCP is like sending a numbered, registered letter series where the recipient signs for each one and you resend any that go missing, while also not mailing faster than they can open them.',
              keyPoints: [
                'Sequence numbers let the receiver reorder segments correctly.',
                'Acknowledgements plus retransmission repair lost data.',
                'Flow control uses a receiver window to avoid overwhelming the receiver.',
                'Congestion control backs off when the network is overloaded.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant S as Sender',
                  '  participant R as Receiver',
                  '  S->>R: segment one',
                  '  S->>R: segment two lost',
                  '  R->>S: ack only one received',
                  '  S->>R: resend segment two',
                ],
                caption: 'TCP detects a missing segment through acknowledgements and retransmits it to guarantee delivery.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does TCP ensure data arrives in the correct order?',
                  hint: 'Every byte gets a label.',
                  solution: {
                    explanation:
                      'It assigns sequence numbers to bytes, so the receiver can reassemble segments in order even if they arrive out of sequence, and can detect gaps that need retransmission.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference between flow control and congestion control?',
                  solution: {
                    explanation:
                      'Flow control protects a slow receiver by limiting the sender to the receivers advertised window. Congestion control protects the network itself by backing off the sending rate when overload or loss is detected.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A sender transmits a segment and never receives an acknowledgement for it. What does TCP do?',
                  solution: {
                    explanation:
                      'After a timeout it retransmits the unacknowledged segment. This automatic retransmission is the core mechanism by which TCP recovers from packet loss.',
                  },
                },
              ],
              docs: 'https://www.rfc-editor.org/rfc/rfc9293',
            },
            {
              id: 'nw3-t0-c3',
              title: 'When UDP wins',
              summary:
                'UDP is a lightweight, connectionless transport with no handshake or reliability guarantees. That simplicity makes it ideal for speed-sensitive, loss-tolerant traffic.',
              explanation:
                'UDP is the minimalist alternative to TCP. It just wraps data in a small header with source and destination ports and a checksum, then fires it off with no handshake, no acknowledgements, no ordering and no retransmission. Packets may arrive out of order, duplicated, or not at all, and UDP will not notice or care. That sounds like a flaw, but for some applications it is exactly right. Real-time voice and video calls prefer to skip a late packet rather than wait for a retransmission that would arrive too late to be useful, so a brief glitch beats a stall. DNS lookups are tiny single-exchange requests where setting up a TCP connection would be wasteful overhead. Online games need the freshest position data, not stale resends. Because UDP gives applications control, modern protocols like QUIC build their own reliability on top of UDP while avoiding TCP limitations. The rule of thumb: use TCP when every byte must arrive, and UDP when timeliness matters more than completeness.',
              analogy:
                'TCP is registered mail with signatures; UDP is shouting across a noisy room. If a word is missed during a live conversation, repeating it later would only confuse things.',
              keyPoints: [
                'UDP is connectionless with no handshake, ordering or retransmission.',
                'It has very low overhead and latency compared with TCP.',
                'Ideal for real-time media, DNS lookups and online games.',
                'Modern protocols like QUIC add custom reliability on top of UDP.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  A[Application] --> U[UDP add ports and checksum]',
                  '  U --> S[Send immediately]',
                  '  S --> N[Network may drop or reorder]',
                ],
                caption: 'UDP adds only a tiny header and sends right away, leaving any reliability to the application.',
              },
              commonMistakes: [
                'Assuming UDP is always worse than TCP — for real-time traffic it is better.',
                'Expecting UDP to guarantee delivery or ordering; it guarantees neither.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is UDP often preferred for live voice and video calls?',
                  hint: 'Think about what happens if you wait to resend a late packet.',
                  solution: {
                    explanation:
                      'Because timeliness matters more than completeness. A retransmitted packet would arrive too late to be useful, so it is better to skip a lost packet (a brief glitch) than to stall waiting for it.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What reliability guarantees does UDP provide?',
                  solution: { explanation: 'None. UDP offers no handshake, no acknowledgements, no ordering and no retransmission. Any needed reliability must be added by the application, as QUIC does.' },
                },
                {
                  type: 'predict',
                  prompt: 'A new protocol needs both low latency and custom reliability features TCP lacks. What transport might it build on, and why?',
                  solution: {
                    explanation:
                      'UDP, because its minimalism lets the protocol implement exactly the reliability and congestion behaviour it wants without TCP constraints. This is precisely the approach QUIC, used by HTTP/3, takes.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/',
            },
          ],
        },
        {
          id: 'nw3-t1',
          name: 'DNS',
          concepts: [
            {
              id: 'nw3-t1-c0',
              title: 'Name resolution and the DNS hierarchy',
              summary:
                'DNS translates human-friendly names into IP addresses by walking a distributed hierarchy of resolvers, root servers, TLD servers and authoritative servers.',
              explanation:
                'People remember names but networks route by numbers, so the Domain Name System acts as the Internet phone book, turning a name into an IP address. The lookup is a coordinated chain. Your device asks a recursive resolver, usually run by your ISP or a public provider, to do the work. If the answer is not cached, the resolver starts at the top: it asks a root server, which points it to the server responsible for the top-level domain such as the part after the last dot. That TLD server points to the authoritative name server for the specific domain, and that authoritative server finally returns the actual IP address. The resolver caches the result and hands it back to your device, which can then connect. The hierarchy is deliberately distributed so that no single server holds all names and the system scales to billions of lookups. This whole exchange usually takes only milliseconds thanks to heavy caching at every level.',
              analogy:
                'It is like finding a phone number by asking a librarian who directs you to the right floor, then the right shelf, then the right book — each step narrowing the search.',
              keyPoints: [
                'DNS maps human names to IP addresses, like a phone book.',
                'A recursive resolver does the lookup work on your behalf.',
                'The hierarchy goes root, then TLD server, then authoritative server.',
                'Caching at every level keeps lookups fast and the system scalable.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant C as Client',
                  '  participant R as Resolver',
                  '  participant Root as Root',
                  '  participant Auth as Authoritative',
                  '  C->>R: where is the name',
                  '  R->>Root: ask root then TLD',
                  '  R->>Auth: ask authoritative',
                  '  Auth->>R: here is the address',
                  '  R->>C: here is the address',
                ],
                caption: 'A DNS lookup walks the hierarchy via the resolver and returns the IP address to the client.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In a DNS lookup, what is the role of the recursive resolver?',
                  hint: 'It does the legwork for your device.',
                  solution: {
                    explanation:
                      'The recursive resolver performs the lookup on the clients behalf, querying root, TLD and authoritative servers as needed, then caches and returns the final answer to the client.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Put these in the order DNS queries them: authoritative server, root server, TLD server.',
                  solution: { explanation: 'Root server first, then the TLD server it points to, then the authoritative server for the domain, which returns the address.' },
                },
                {
                  type: 'predict',
                  prompt: 'Why does the second visit to a website usually resolve its name faster than the first?',
                  solution: {
                    explanation:
                      'Because the answer was cached by the resolver (and possibly the device) during the first lookup, so the second time it can be returned immediately without walking the full hierarchy.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/dns/what-is-dns/',
            },
            {
              id: 'nw3-t1-c1',
              title: 'Common DNS record types',
              summary:
                'A DNS zone holds records of different types. A and AAAA point to IP addresses, CNAME aliases names, MX directs mail, and TXT stores text data.',
              explanation:
                'DNS stores more than just addresses; each domain has a set of records, each with a type that defines its purpose. An A record maps a name to an IPv4 address, and an AAAA record maps a name to an IPv6 address. A CNAME record makes one name an alias for another, so several hostnames can resolve to a canonical name without duplicating its addresses. An MX (mail exchange) record tells other mail servers where to deliver email for the domain, with priorities for backups. A TXT record holds arbitrary text and is widely used for verification and for email security policies like SPF, DKIM and DMARC that help prove a message is legitimately from the domain. There are many more types, such as NS records that delegate a zone to its name servers, but these few cover most everyday needs. Knowing record types is essential for setting up websites, email and the many third-party services that ask you to add a record to prove you control a domain.',
              analogy:
                'A DNS zone is like a contact card with several fields: home address (A), forwarding alias (CNAME), where to send mail (MX), and notes (TXT). Each field type has its own meaning.',
              keyPoints: [
                'A maps a name to IPv4; AAAA maps a name to IPv6.',
                'CNAME makes a name an alias for another canonical name.',
                'MX directs incoming email to the right mail servers.',
                'TXT holds text, often for domain verification and email security.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'dig example.com A',
                  'dig example.com MX',
                  'dig example.com TXT',
                  '# each query asks for one record type from DNS',
                ],
                explanation: 'The dig tool queries specific record types; naming the type after the domain returns just those records.',
              },
              commonMistakes: [
                'Putting a CNAME at the root of a domain, which is generally not allowed alongside other records.',
                'Forgetting that email security relies on correct TXT records (SPF, DKIM, DMARC).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between an A record and an AAAA record?',
                  hint: 'Think IPv4 versus IPv6.',
                  solution: {
                    explanation:
                      'An A record maps a name to an IPv4 address, while an AAAA record maps a name to an IPv6 address. Both answer the same question for different IP versions.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which record type tells other servers where to deliver email for a domain?',
                  solution: { explanation: 'The MX (mail exchange) record. It lists the mail servers for a domain along with priority values for failover.' },
                },
                {
                  type: 'predict',
                  prompt: 'A service asks you to add a TXT record to your domain. What is the likely purpose?',
                  solution: {
                    explanation:
                      'Domain ownership verification or an email security policy. TXT records commonly carry verification tokens and SPF, DKIM or DMARC data that prove control or authorise mail.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/dns/dns-records/',
            },
            {
              id: 'nw3-t1-c2',
              title: 'Caching and TTL',
              summary:
                'DNS answers are cached and expire after a time-to-live (TTL). TTL balances fast, low-load lookups against how quickly changes propagate.',
              explanation:
                'Caching is what makes DNS fast and scalable. When a resolver gets an answer, it stores it and serves it to later queries instead of repeating the full hierarchy walk. Each record carries a TTL value, set by the domain owner, that says how many seconds the answer may be cached before it must be looked up again. A long TTL means fewer queries and faster responses, but changes take longer to reach everyone because old answers linger in caches. A short TTL means changes propagate quickly but generates more lookups and load. This trade-off matters when you plan a change: if you are about to move a service to a new IP address, you typically lower the TTL well in advance so caches expire quickly, make the change, then raise the TTL again once it is stable. Caches exist at many levels, including the resolver, the operating system and the browser, so a change can appear to take effect at different times for different people.',
              analogy:
                'TTL is the use-by date on a cached answer. A long date means you keep using the old info longer; a short date means you refresh often and notice changes sooner.',
              keyPoints: [
                'Resolvers cache DNS answers to avoid repeating lookups.',
                'TTL sets how long an answer may be cached before refresh.',
                'Long TTL means speed and low load but slow change propagation.',
                'Lower TTL before a planned IP change, then raise it again afterward.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Q[Query] --> Cache{In cache and fresh}',
                  '  Cache -->|yes| Fast[Return cached answer]',
                  '  Cache -->|no| Walk[Walk hierarchy then cache]',
                ],
                caption: 'A fresh cached answer is returned instantly; an expired one triggers a full lookup that refreshes the cache.',
              },
              commonMistakes: [
                'Changing a record without first lowering its TTL, so old answers linger for a long time.',
                'Assuming a DNS change is instant everywhere — caches expire at different times.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does the TTL of a DNS record control?',
                  hint: 'It is about how long an answer stays valid.',
                  solution: {
                    explanation:
                      'It controls how long, in seconds, a resolver may cache the answer before it must look it up again. It governs the balance between speed and how fast changes propagate.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You plan to move a website to a new IP next week. Why lower the TTL a few days beforehand?',
                  solution: {
                    explanation:
                      'So caches expire quickly when you make the switch, letting the new address propagate fast and minimising the time users hit the old IP. You raise the TTL again once the change is stable.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the downside of a very short TTL?',
                  solution: { explanation: 'More frequent lookups, increasing query load on resolvers and authoritative servers and slightly slowing average response time, since fewer answers are served from cache.' },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/dns/what-is-dns/',
            },
          ],
        },
        {
          id: 'nw3-t2',
          name: 'DHCP and address assignment',
          concepts: [
            {
              id: 'nw3-t2-c0',
              title: 'DHCP and the DORA process',
              summary:
                'DHCP automatically gives a device an IP address and network settings when it joins a network, using a four-step exchange known as DORA.',
              explanation:
                'When a device joins a network it needs an IP address, a subnet mask, a default gateway and DNS server addresses. Configuring all of that by hand on every device would be unworkable, so the Dynamic Host Configuration Protocol does it automatically. The exchange has four steps remembered as DORA. First the new device broadcasts a Discover message asking if any DHCP server is present, since it has no address yet. A DHCP server replies with an Offer proposing an address and settings. The device responds with a Request formally asking for that offered address, which also tells any other servers it declined their offers. Finally the server sends an Acknowledgement confirming the lease, and the device configures itself with the supplied settings. From then on the device can communicate normally. Because the first messages are broadcasts, DHCP works within a broadcast domain, and a relay agent is used to reach a DHCP server on another subnet.',
              analogy:
                'DORA is like checking into a hotel: you ask if rooms are free (Discover), the desk offers one (Offer), you say yes I will take it (Request), and they hand you the key (Acknowledge).',
              keyPoints: [
                'DHCP automatically assigns IP address, mask, gateway and DNS settings.',
                'The four steps are Discover, Offer, Request, Acknowledge.',
                'The first messages are broadcasts because the device has no address yet.',
                'A relay agent lets DHCP reach a server on a different subnet.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant D as Device',
                  '  participant S as DHCP server',
                  '  D->>S: Discover',
                  '  S->>D: Offer',
                  '  D->>S: Request',
                  '  S->>D: Acknowledge',
                ],
                caption: 'The DORA exchange by which a device obtains an IP address and configuration from a DHCP server.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What do the four letters of DORA stand for?',
                  hint: 'It is the order of the DHCP messages.',
                  solution: {
                    explanation:
                      'Discover, Offer, Request, Acknowledge. The device discovers servers, a server offers settings, the device requests them, and the server acknowledges the lease.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why must the initial DHCP Discover message be a broadcast?',
                  solution: {
                    explanation:
                      'Because the device has no IP address yet and does not know the DHCP servers address, so it cannot send a unicast. Broadcasting reaches any DHCP server on the local link.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Besides an IP address, name two other settings DHCP can provide.',
                  solution: { explanation: 'It can supply the subnet mask, the default gateway, and DNS server addresses, among others, giving a device everything it needs to communicate.' },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-dhcp/',
            },
            {
              id: 'nw3-t2-c1',
              title: 'Leases and link-local addresses',
              summary:
                'DHCP addresses are leased for a limited time and must be renewed. If no DHCP server answers, a device can self-assign a link-local address.',
              explanation:
                'DHCP does not give an address away forever; it lends it for a lease duration. Partway through the lease the device tries to renew it so it can keep the same address, and if the server is unreachable it keeps trying until the lease finally expires, at which point it must request a new one. Leasing lets a network reuse a limited pool of addresses efficiently as devices come and go, and it lets administrators change settings that propagate at the next renewal. If a device finds no DHCP server at all, it can fall back to a link-local address that it picks itself from a reserved range without any server. Link-local addresses only work within the local link and are never routed, so a device stuck on one can usually talk to neighbours but cannot reach the Internet, which is a classic symptom of a failed DHCP server. Recognising a self-assigned link-local address is a quick diagnostic clue that DHCP is not responding.',
              analogy:
                'A DHCP lease is like renting a parking spot by the hour and topping up the meter to keep it. A link-local address is parking on your own driveway when the public lot is closed — fine locally, but you cannot drive it onto the highway.',
              keyPoints: [
                'DHCP addresses are leased for a limited time and renewed periodically.',
                'Leasing lets a small address pool serve many transient devices.',
                'With no DHCP server, a device self-assigns a link-local address.',
                'Link-local addresses are not routable, so a device on one cannot reach the Internet.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  J[Device joins] --> A{DHCP server answers}',
                  '  A -->|yes| L[Leased address renew later]',
                  '  A -->|no| LL[Self assigned link local]',
                  '  LL --> NoNet[Local only no Internet]',
                ],
                caption: 'A device gets a leased address from DHCP, or falls back to a non-routable link-local address if no server responds.',
              },
              commonMistakes: [
                'Mistaking a link-local address for a working configuration — it cannot reach the Internet.',
                'Assuming a leased address is permanent; it must be renewed before it expires.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is a DHCP lease and why does it expire?',
                  hint: 'Addresses are lent, not given.',
                  solution: {
                    explanation:
                      'A lease is a time-limited assignment of an IP address. Expiry lets the network reclaim and reuse addresses from a limited pool as devices come and go, and it allows settings to update on renewal.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A laptop shows a self-assigned link-local address and cannot reach the Internet. What is the likely cause?',
                  solution: {
                    explanation:
                      'No DHCP server responded, so the laptop fell back to a link-local address. Because such addresses are not routable, it can only talk to local neighbours, not the Internet. The DHCP service likely needs fixing.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Can a device with only a link-local address browse a website on the Internet?',
                  solution: { explanation: 'No. Link-local addresses are confined to the local link and are never routed, so Internet destinations are unreachable from one.' },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-dhcp/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 4 — APPLICATION LAYER AND THE WEB ───────────────────── */
    {
      level: 4,
      name: 'Application Layer and the Web',
      focus: 'HTTP and HTTPS, the TLS and PKI that secure them, and the other protocols that power email, files and real-time apps',
      accent: '#0ea5e9',
      soft: '#e3f5fd',
      topics: [
        {
          id: 'nw4-t0',
          name: 'HTTP and HTTPS',
          concepts: [
            {
              id: 'nw4-t0-c0',
              title: 'HTTP requests, responses and methods',
              summary:
                'HTTP is the request-response protocol of the Web. A client sends a request with a method and path, and the server returns a response with a status and body.',
              explanation:
                'HTTP is the language browsers and servers speak to exchange web resources. Communication is a cycle: the client sends a request and the server sends back a response, after which (in the classic model) the exchange is complete. A request names a method that states the intent, a path identifying the resource, headers carrying metadata, and an optional body. The common methods are GET to retrieve a resource, POST to submit data, PUT to replace a resource, PATCH to modify part of it, and DELETE to remove it. GET should be safe and have no side effects, while POST typically changes state. HTTP is described as stateless, meaning each request is independent and the server does not inherently remember previous ones, which is why mechanisms like cookies exist to carry context. Understanding the request-response structure and the meaning of each method is the foundation for building and debugging anything on the Web.',
              analogy:
                'HTTP is like ordering at a counter: you state what you want and how (the method and path), the server fetches it, and hands back the result with a receipt (the status and headers).',
              keyPoints: [
                'HTTP is a request-response protocol between client and server.',
                'A request has a method, path, headers and optional body.',
                'Common methods: GET retrieve, POST submit, PUT replace, PATCH modify, DELETE remove.',
                'HTTP is stateless, so each request is independent of the others.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant B as Browser',
                  '  participant S as Server',
                  '  B->>S: GET path with headers',
                  '  S->>B: status code and body',
                ],
                caption: 'A single HTTP exchange: the browser requests a resource and the server responds.',
              },
              code: {
                language: 'text',
                lines: [
                  'GET /index.html HTTP/1.1',
                  'Host: example.com',
                  'Accept: text/html',
                  '',
                  '(blank line ends the request headers)',
                ],
                explanation: 'A minimal HTTP request: the method and path on the first line, headers below, and a blank line marking the end of the headers.',
              },
              commonMistakes: [
                'Using GET for actions that change data — GET should be safe and side-effect free.',
                'Forgetting HTTP is stateless, so the server needs cookies or tokens to recognise repeat visitors.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which HTTP method should be used to retrieve a resource without side effects?',
                  hint: 'It is the most common method for reading.',
                  solution: {
                    explanation:
                      'GET. It is intended to be safe and idempotent, retrieving a resource without changing server state. Methods like POST are for submitting data that changes state.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does it mean that HTTP is stateless?',
                  solution: {
                    explanation:
                      'Each request is independent and the server does not inherently remember previous requests. Context like a logged-in session must be carried explicitly, typically via cookies or tokens.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A developer uses GET to delete records by visiting a link. Why is this risky?',
                  solution: {
                    explanation:
                      'GET is meant to be safe, so browsers, crawlers and prefetchers may follow such links automatically, deleting data unintentionally. State-changing actions should use POST, PUT, PATCH or DELETE.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods',
            },
            {
              id: 'nw4-t0-c1',
              title: 'Status codes and headers',
              summary:
                'HTTP responses carry a numeric status code grouped by class, plus headers that convey metadata about the request, response and content.',
              explanation:
                'Every HTTP response begins with a three-digit status code that summarises the outcome, organised into five classes by their first digit. The 1xx range is informational, 2xx means success (200 is the usual OK), 3xx means redirection (301 is a permanent move, 304 means not modified so use your cache), 4xx means a client error (404 not found, 401 unauthorised, 403 forbidden), and 5xx means a server error (500 internal error, 503 service unavailable). Knowing the class instantly tells you whether the problem is yours or the servers. Headers accompany both requests and responses as key-value metadata. Request headers include Host to name the site and Accept to state acceptable formats; response headers include Content-Type to describe the body, Cache-Control to govern caching, and Set-Cookie to store data in the browser. Headers are how HTTP stays flexible without changing the core method-and-status structure, carrying everything from authentication to compression negotiation.',
              analogy:
                'A status code is like a delivery outcome stamp — delivered, moved address, not found, our depot broke. The headers are the extra notes on the package label.',
              keyPoints: [
                'Status codes are grouped by first digit: 2xx success, 3xx redirect, 4xx client error, 5xx server error.',
                '404 means not found, 401 unauthorised, 500 server error, 301 moved permanently.',
                'Headers carry metadata on both requests and responses.',
                'Key headers include Host, Accept, Content-Type, Cache-Control and Set-Cookie.',
              ],
              code: {
                language: 'text',
                lines: [
                  'HTTP/1.1 200 OK',
                  'Content-Type: text/html; charset=utf-8',
                  'Cache-Control: max-age=3600',
                  '',
                  '(then the response body follows)',
                ],
                explanation: 'A response line with status 200 OK, followed by headers describing the content and its caching, then the body.',
              },
              commonMistakes: [
                'Confusing 401 (not authenticated) with 403 (authenticated but not allowed).',
                'Treating all 3xx redirects the same — 301 is permanent, 302 temporary, 304 use cache.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does a 5xx status code class indicate, versus a 4xx class?',
                  hint: 'One blames the server, one blames the request.',
                  solution: {
                    explanation:
                      '5xx indicates a server-side error (the server failed to fulfil a valid request), while 4xx indicates a client-side error (something wrong with the request, like a bad URL or missing auth).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which response header tells the browser what kind of data the body contains?',
                  solution: { explanation: 'Content-Type. It describes the media type of the body, such as text or HTML or JSON, so the browser knows how to interpret it.' },
                },
                {
                  type: 'predict',
                  prompt: 'A request to a protected page returns 401. What is the client expected to do?',
                  solution: {
                    explanation:
                      'Authenticate and retry, because 401 means the request lacked valid credentials. This differs from 403, where the user is authenticated but still not permitted to access the resource.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
            },
            {
              id: 'nw4-t0-c2',
              title: 'Cookies and state on the Web',
              summary:
                'Because HTTP is stateless, cookies let a server store small pieces of data in the browser that are sent back on later requests to remember context.',
              explanation:
                'Since HTTP does not remember requests, the Web needs a way to maintain context like a login session or a shopping cart, and cookies are the classic mechanism. A server sets a cookie by sending a Set-Cookie response header, and the browser stores it and automatically attaches it in a Cookie header on subsequent requests to that site, letting the server recognise the returning client. Cookies have attributes that control their behaviour and safety. Expires or Max-Age sets how long they last; the Secure attribute restricts them to HTTPS; HttpOnly hides them from JavaScript to reduce theft via scripting attacks; and SameSite limits whether they are sent on cross-site requests, defending against cross-site request forgery. Cookies are tiny and sent on every matching request, so they are best used for identifiers rather than bulky data. They are central to authentication and personalisation, but also to tracking, which is why privacy rules increasingly govern their use.',
              analogy:
                'A cookie is like a coat-check ticket: the server gives you a stub, and each time you return you present it so they know which coat (session) is yours.',
              keyPoints: [
                'Cookies add state on top of stateless HTTP.',
                'The server sends Set-Cookie; the browser returns it in a Cookie header.',
                'Secure restricts to HTTPS and HttpOnly hides cookies from JavaScript.',
                'SameSite limits cross-site sending to defend against request forgery.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant B as Browser',
                  '  participant S as Server',
                  '  S->>B: Set Cookie session id',
                  '  B->>S: later request includes Cookie',
                  '  S->>B: recognises the session',
                ],
                caption: 'The server sets a cookie once, and the browser returns it on later requests so the session is remembered.',
              },
              commonMistakes: [
                'Storing sensitive data in cookies without Secure and HttpOnly attributes.',
                'Putting large amounts of data in cookies, which are sent on every matching request.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does a cookie get from the server to the browser and back?',
                  hint: 'Two headers are involved.',
                  solution: {
                    explanation:
                      'The server sends it in a Set-Cookie response header; the browser stores it and automatically includes it in a Cookie header on later requests to that site.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does the HttpOnly cookie attribute protect against?',
                  solution: { explanation: 'It prevents JavaScript from reading the cookie, reducing the risk of theft through cross-site scripting attacks since malicious scripts cannot access it.' },
                },
                {
                  type: 'predict',
                  prompt: 'Why might a developer set SameSite on a session cookie?',
                  solution: {
                    explanation:
                      'To limit when the cookie is sent on cross-site requests, defending against cross-site request forgery where another site tricks the browser into making an authenticated request.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies',
            },
            {
              id: 'nw4-t0-c3',
              title: 'HTTP/1.1 versus HTTP/2 versus HTTP/3',
              summary:
                'The HTTP protocol has evolved to be faster. HTTP/2 multiplexes streams over one connection, and HTTP/3 moves onto QUIC over UDP to cut latency further.',
              explanation:
                'HTTP/1.1 handles one request at a time per connection, so browsers open several connections in parallel and can suffer head-of-line blocking where one slow response stalls a connection. HTTP/2 fixed much of this by multiplexing many requests and responses as independent streams over a single connection, adding header compression and server push, which greatly reduced overhead. However HTTP/2 still runs over TCP, so a single lost packet can stall all the multiplexed streams because TCP delivers bytes strictly in order, a transport-level head-of-line blocking. HTTP/3 addresses this by running over QUIC, a transport built on UDP that implements its own streams, reliability and congestion control, so loss in one stream no longer blocks the others. QUIC also integrates TLS 1.3 and can establish a secure connection in fewer round trips, lowering latency, and it survives network changes like switching from WiFi to cellular without dropping the connection. In practice all three coexist, with clients and servers negotiating the best version they share.',
              analogy:
                'HTTP/1.1 is a single checkout lane; HTTP/2 is many lanes sharing one cashier so one stuck customer blocks everyone; HTTP/3 gives each lane its own cashier so a jam in one does not freeze the rest.',
              keyPoints: [
                'HTTP/1.1 does one request per connection and suffers head-of-line blocking.',
                'HTTP/2 multiplexes many streams over one TCP connection with header compression.',
                'HTTP/2 still has transport-level head-of-line blocking because of TCP ordering.',
                'HTTP/3 runs on QUIC over UDP, removing that blocking and cutting setup latency.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  H1[HTTP one one over TCP] --> H2[HTTP two multiplexed over TCP]',
                  '  H2 --> H3[HTTP three over QUIC over UDP]',
                  '  H3 --> Fast[Less head of line blocking]',
                ],
                caption: 'The evolution of HTTP toward multiplexing and then a UDP-based transport that avoids transport-level blocking.',
              },
              commonMistakes: [
                'Believing HTTP/2 fully eliminates head-of-line blocking — TCP still causes it at the transport level.',
                'Thinking HTTP/3 abandons reliability because it uses UDP — QUIC adds its own reliability.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What key improvement did HTTP/2 bring over HTTP/1.1?',
                  hint: 'Many requests, one connection.',
                  solution: {
                    explanation:
                      'Multiplexing: many requests and responses travel as independent streams over a single connection, along with header compression, reducing the overhead and parallel connections HTTP/1.1 needed.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What transport does HTTP/3 use, and why?',
                  solution: {
                    explanation:
                      'QUIC, which runs over UDP. QUIC implements its own streams and reliability so a lost packet does not block all streams, and it integrates TLS 1.3 for faster, more resilient connections.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why can a single lost packet still stall all streams in HTTP/2 but not in HTTP/3?',
                  solution: {
                    explanation:
                      'HTTP/2 runs over TCP, which delivers bytes strictly in order, so a lost packet blocks everything behind it. HTTP/3 over QUIC gives each stream independent delivery, so loss in one stream does not block the others.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/performance/what-is-http3/',
            },
          ],
        },
        {
          id: 'nw4-t1',
          name: 'TLS, SSL and PKI',
          concepts: [
            {
              id: 'nw4-t1-c0',
              title: 'Symmetric versus asymmetric encryption',
              summary:
                'Symmetric encryption uses one shared key for speed; asymmetric encryption uses a public and private key pair. TLS combines both to get the best of each.',
              explanation:
                'Encryption scrambles data so only authorised parties can read it, and there are two broad families. Symmetric encryption uses a single secret key shared by both sides to encrypt and decrypt; it is fast and ideal for bulk data, but it raises the hard problem of how the two sides agree on the secret without an eavesdropper learning it. Asymmetric encryption uses a mathematically linked key pair: a public key that anyone may know and a private key kept secret. Data encrypted with the public key can only be decrypted with the matching private key, and a signature made with the private key can be verified with the public key. Asymmetric is slower, so it is not used for bulk data. The brilliant move in protocols like TLS is to combine them: asymmetric cryptography is used briefly to authenticate the parties and securely agree on a fresh symmetric key, and then fast symmetric encryption protects the actual conversation. This hybrid gives both strong key exchange and efficient bulk encryption.',
              analogy:
                'Asymmetric keys are like a mailbox with a public slot anyone can drop letters into but only your private key opens. Symmetric is a shared safe combination — fast to use once both sides know it.',
              keyPoints: [
                'Symmetric encryption uses one shared key: fast but needs secure key sharing.',
                'Asymmetric encryption uses a public and private key pair.',
                'Public-key data is only readable with the matching private key.',
                'TLS uses asymmetric to exchange a key, then symmetric for the bulk data.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  A[Asymmetric exchange a key] --> B[Agree shared secret]',
                  '  B --> C[Symmetric encrypt the data]',
                  '  C --> D[Fast secure conversation]',
                ],
                caption: 'TLS uses slow asymmetric cryptography to agree a key, then fast symmetric encryption for the rest of the session.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why does TLS use both symmetric and asymmetric encryption rather than just one?',
                  hint: 'Each has a strength and a weakness.',
                  solution: {
                    explanation:
                      'Asymmetric safely solves key exchange and authentication but is slow; symmetric is fast but needs a shared key. TLS uses asymmetric to securely agree on a symmetric key, then symmetric for efficient bulk encryption.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'If data is encrypted with someones public key, who can decrypt it?',
                  solution: { explanation: 'Only the holder of the matching private key. That is the defining property of asymmetric encryption and what makes secure key exchange possible.' },
                },
                {
                  type: 'predict',
                  prompt: 'Why is symmetric encryption not simply used for the entire connection from the start?',
                  solution: {
                    explanation:
                      'Because both sides must first share the secret key securely over an insecure network. Asymmetric cryptography solves that bootstrapping problem, after which symmetric takes over for speed.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/ssl/what-is-asymmetric-encryption/',
            },
            {
              id: 'nw4-t1-c1',
              title: 'The TLS handshake',
              summary:
                'TLS secures connections by authenticating the server and agreeing on encryption keys. TLS 1.3 streamlines this handshake to a single round trip.',
              explanation:
                'TLS is the protocol that turns plain HTTP into HTTPS by adding encryption, integrity and authentication. It begins with a handshake before any application data flows. The client offers the TLS versions and cipher suites it supports, the server responds with its choice and presents its certificate, and the two perform a key exchange that lets them derive a shared symmetric key without ever sending it in the clear, using a method that provides forward secrecy so past traffic stays safe even if a key is later compromised. The client verifies the certificate to confirm it is really talking to the intended server, and once both sides have the shared key they switch to encrypted communication. TLS 1.3, the current version, removed old insecure options and reduced the handshake to a single round trip, with an optional zero round-trip mode for resumed sessions, making secure connections noticeably faster than in TLS 1.2. The result is confidentiality, tamper detection and server identity assurance.',
              analogy:
                'The TLS handshake is like two people meeting, checking each other\'s ID card, then quietly agreeing on a secret code before discussing anything sensitive.',
              keyPoints: [
                'TLS adds encryption, integrity and authentication, turning HTTP into HTTPS.',
                'The handshake negotiates the version and cipher, then exchanges keys.',
                'The server presents a certificate the client verifies for identity.',
                'TLS 1.3 cuts the handshake to one round trip and provides forward secrecy.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant C as Client',
                  '  participant S as Server',
                  '  C->>S: hello with supported ciphers',
                  '  S->>C: chosen cipher and certificate',
                  '  C->>S: key exchange and finished',
                  '  S->>C: finished encrypted from now',
                ],
                caption: 'A simplified TLS 1.3 handshake establishing identity and a shared key in one round trip.',
              },
              commonMistakes: [
                'Confusing the TLS handshake with the TCP handshake — TLS runs on top of TCP (or QUIC).',
                'Assuming HTTPS only encrypts; it also authenticates the server and detects tampering.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What three protections does TLS add to a connection?',
                  hint: 'Beyond just hiding the data.',
                  solution: {
                    explanation:
                      'Confidentiality (encryption), integrity (tamper detection), and authentication (verifying the server identity via its certificate). Together they make HTTPS trustworthy.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What did TLS 1.3 improve about the handshake compared with TLS 1.2?',
                  solution: { explanation: 'It reduced the handshake to a single round trip (with optional zero round trip on resumption) and removed outdated insecure cipher options, making connections faster and safer.' },
                },
                {
                  type: 'predict',
                  prompt: 'What does forward secrecy guarantee if a server private key is stolen next year?',
                  solution: {
                    explanation:
                      'Past recorded sessions remain unreadable, because each session used a fresh ephemeral key not derivable from the long-term private key. Only future sessions could be at risk, not previously captured traffic.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/',
            },
            {
              id: 'nw4-t1-c2',
              title: 'Certificates, CAs and the chain of trust',
              summary:
                'A digital certificate binds a domain name to a public key, vouched for by a certificate authority. Browsers trust a chain leading back to a known root.',
              explanation:
                'A TLS certificate is a signed statement that a particular public key belongs to a particular domain name. The signing is done by a certificate authority (CA), a trusted organisation whose job is to verify that the requester actually controls the domain before issuing the certificate. Your operating system and browser ship with a built-in list of trusted root CAs. When a server presents its certificate, the browser checks that it was signed by a CA it trusts, following a chain: the server certificate is signed by an intermediate CA, which is signed by a root CA in the trust store. If every link is valid, the domain matches, and the certificate has not expired or been revoked, the browser shows the connection as secure. This public key infrastructure (PKI) is what lets you trust a site you have never visited, because you trust the CA that vouched for it. Free automated CAs have made HTTPS the default across the Web, and certificates are now typically short-lived and renewed automatically.',
              analogy:
                'A certificate is like a passport: you trust it not because you know the traveller but because a government (the CA) you trust issued and signed it, and you can trace the authority back to a source you recognise.',
              keyPoints: [
                'A certificate binds a domain name to a public key.',
                'A certificate authority verifies domain control and signs the certificate.',
                'Browsers trust a chain from the server certificate up to a known root CA.',
                'Validity checks include matching domain, expiry and revocation status.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Root[Trusted root CA] --> Inter[Intermediate CA]',
                  '  Inter --> Site[Server certificate]',
                  '  Site --> Browser[Browser verifies the chain]',
                ],
                caption: 'The chain of trust runs from a trusted root CA through intermediates down to the server certificate the browser checks.',
              },
              code: {
                language: 'bash',
                lines: [
                  'openssl s_client -connect example.com:443',
                  '# prints the certificate chain the server presents',
                  '# verify return shows whether the chain validated',
                ],
                explanation: 'This command opens a TLS connection and shows the certificate chain and whether it validated against the trust store.',
              },
              commonMistakes: [
                'Thinking a valid certificate means a site is safe — it proves identity and encryption, not honesty.',
                'Ignoring expiry; an expired certificate breaks trust even if everything else is correct.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does a certificate authority actually verify before issuing a certificate?',
                  hint: 'It is about control of the name.',
                  solution: {
                    explanation:
                      'That the requester genuinely controls the domain name the certificate is for. The CA then signs a certificate binding that domain to the requesters public key.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why does a browser trust a certificate from a site it has never visited?',
                  solution: {
                    explanation:
                      'Because the certificate chains up to a root CA already in the browsers trust store. The browser trusts the CA, and the CA vouched for the site, so the trust is transitive.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A browser warns that a certificate is not trusted even though the site loads. What might be wrong?',
                  solution: {
                    explanation:
                      'The chain could be broken (missing intermediate), the certificate may be expired, self-signed by an untrusted issuer, revoked, or the domain name may not match. Any of these breaks the chain of trust.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/ssl/what-is-an-ssl-certificate/',
            },
          ],
        },
        {
          id: 'nw4-t2',
          name: 'Other application protocols',
          concepts: [
            {
              id: 'nw4-t2-c0',
              title: 'Email protocols: SMTP, IMAP and POP3',
              summary:
                'Email uses different protocols for sending and retrieving. SMTP sends and relays mail, while IMAP and POP3 let a client read mail from a server.',
              explanation:
                'Email is older than the Web and uses a split design. SMTP, the Simple Mail Transfer Protocol, is the protocol for sending mail: your client uses it to submit a message, and mail servers use it to relay messages to each other until they reach the recipients server. SMTP only pushes mail toward its destination; it is not used to read your inbox. To retrieve mail, clients use one of two protocols. POP3 downloads messages to the device and traditionally removes them from the server, which suits a single device but does not sync across many. IMAP keeps messages on the server and synchronises state like read flags and folders across all your devices, which is why it dominates today when people check mail on a phone and laptop alike. Modern email also layers on security: connections use TLS to encrypt the transfer, and DNS records like SPF, DKIM and DMARC help prove a message genuinely came from the claimed domain, fighting spoofing and spam.',
              analogy:
                'SMTP is the postal system that carries letters to the right post office; IMAP and POP3 are two ways of collecting your mail — IMAP reads it at the shared post box everyone in the family can see, POP3 takes it home.',
              keyPoints: [
                'SMTP sends and relays mail between clients and servers; it does not retrieve.',
                'POP3 downloads mail to one device and often removes it from the server.',
                'IMAP keeps mail on the server and syncs state across devices.',
                'TLS plus SPF, DKIM and DMARC add encryption and anti-spoofing.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Sender[Sender client] -->|SMTP| MS[Mail servers relay]',
                  '  MS -->|SMTP| RS[Recipient server]',
                  '  RS -->|IMAP or POP3| Reader[Recipient client]',
                ],
                caption: 'SMTP moves mail toward the recipient server, while IMAP or POP3 lets the recipient read it.',
              },
              commonMistakes: [
                'Thinking SMTP is used to read mail — it only sends and relays.',
                'Choosing POP3 when you read mail on several devices, where IMAP keeps them in sync.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which email protocol is used to send and relay messages?',
                  hint: 'It is not for reading the inbox.',
                  solution: {
                    explanation:
                      'SMTP, the Simple Mail Transfer Protocol. It submits mail from a client and relays it between servers, but is not used to retrieve messages from your inbox.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the main difference between IMAP and POP3?',
                  solution: {
                    explanation:
                      'IMAP keeps mail on the server and synchronises read state and folders across devices; POP3 typically downloads mail to one device and removes it from the server, with no multi-device sync.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A user reads email on a phone and a laptop and wants both to stay in sync. Which retrieval protocol fits?',
                  solution: {
                    explanation:
                      'IMAP, because it leaves messages on the server and syncs state across devices, so actions on one device (reading, filing) appear on the other. POP3 would not keep them consistent.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/email-security/what-is-smtp/',
            },
            {
              id: 'nw4-t2-c1',
              title: 'SSH for secure remote access',
              summary:
                'SSH, the Secure Shell, provides an encrypted channel to log into and control remote machines, replacing insecure tools like Telnet.',
              explanation:
                'SSH is the standard way administrators and developers connect securely to remote servers. It creates an encrypted tunnel over which you can run a command-line shell, copy files, and forward other connections, all protected from eavesdropping and tampering, unlike the old plaintext Telnet it replaced. SSH authenticates in two stages: the server proves its identity with a host key, which your client remembers so it can warn you if it ever changes (a possible sign of an attack), and then you prove your identity, most securely with a key pair rather than a password. With key-based authentication you keep a private key and place the matching public key on the server, so only someone holding the private key can log in, which is far stronger than a guessable password. SSH also enables powerful features like secure file copy and port forwarding, where it tunnels another connection through the encrypted channel. It runs on a well-known port and is a cornerstone of secure operations on the modern Internet.',
              analogy:
                'SSH is like a private, soundproof tunnel to a remote building. You verify the building is the right one, then unlock the door with a key only you hold, and no one outside can hear what passes through.',
              keyPoints: [
                'SSH gives an encrypted channel for remote login and control.',
                'It replaced insecure plaintext tools like Telnet.',
                'The server proves identity with a host key; clients warn if it changes.',
                'Key-based authentication is stronger than passwords for user login.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'ssh user@server.example.com',
                  '# first connection asks you to confirm the host key fingerprint',
                  '# later connections warn loudly if that key changes',
                ],
                explanation: 'Connecting with ssh checks the servers host key; a changed key triggers a warning because it may indicate an impostor.',
              },
              commonMistakes: [
                'Ignoring host key change warnings, which can signal a man-in-the-middle attack.',
                'Relying on weak passwords instead of key-based authentication.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does SSH provide that Telnet did not?',
                  hint: 'Think about what travels over the wire.',
                  solution: {
                    explanation:
                      'Encryption. SSH protects the entire session from eavesdropping and tampering, while Telnet sent everything, including passwords, in plaintext.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is key-based authentication considered stronger than passwords for SSH?',
                  solution: {
                    explanation:
                      'A private key is far harder to guess or brute-force than a password, and the private key never leaves your machine. Only the holder of the private key can log in to a server holding the matching public key.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'On reconnecting to a familiar server, SSH warns the host key has changed. What should you suspect?',
                  solution: {
                    explanation:
                      'Either the server was legitimately rebuilt or reconfigured, or someone is impersonating it in a man-in-the-middle attack. You should verify the change is expected before continuing.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/access-management/what-is-ssh/',
            },
            {
              id: 'nw4-t2-c2',
              title: 'File transfer and WebSocket',
              summary:
                'FTP transfers files but is insecure; SFTP and FTPS add encryption. WebSocket upgrades an HTTP connection into a persistent two-way channel.',
              explanation:
                'Moving files and keeping live connections are two more common needs with their own protocols. The classic File Transfer Protocol (FTP) sends files but transmits credentials and data in the clear, so it is now discouraged. The secure replacements are SFTP, which carries file transfers inside an SSH-encrypted session, and FTPS, which wraps FTP in TLS. For most secure file work today SFTP is the go-to. WebSocket addresses a different problem. Plain HTTP is request-response, where the client must ask for everything, which is awkward for live updates like chat, notifications or game state. WebSocket starts as an ordinary HTTP request that asks to upgrade the connection, and once the server agrees the same connection becomes a persistent, full-duplex channel where both sides can send messages at any time with low overhead. This is far more efficient than repeatedly polling the server. WebSocket therefore powers real-time web features, while secure file transfer keeps bulk data movement protected.',
              analogy:
                'FTP is mailing documents on a postcard anyone can read; SFTP seals them in an armoured courier. WebSocket is upgrading a one-question-at-a-time phone menu into an open line where either person can speak whenever.',
              keyPoints: [
                'Plain FTP is insecure because credentials and data are sent in the clear.',
                'SFTP runs file transfer over SSH; FTPS wraps FTP in TLS.',
                'WebSocket upgrades an HTTP connection to a persistent two-way channel.',
                'WebSocket suits real-time features like chat and live updates.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant C as Client',
                  '  participant S as Server',
                  '  C->>S: HTTP request asking to upgrade',
                  '  S->>C: agree switch to WebSocket',
                  '  C->>S: message any time',
                  '  S->>C: message any time',
                ],
                caption: 'WebSocket begins as an HTTP upgrade request, then becomes a persistent full-duplex channel.',
              },
              commonMistakes: [
                'Using plain FTP for sensitive transfers when SFTP or FTPS is available.',
                'Polling repeatedly over HTTP for live data when WebSocket would be far more efficient.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is plain FTP discouraged, and what are the secure alternatives?',
                  hint: 'Think about how it sends passwords.',
                  solution: {
                    explanation:
                      'Plain FTP transmits credentials and data unencrypted, so they can be intercepted. The secure alternatives are SFTP (file transfer over SSH) and FTPS (FTP wrapped in TLS).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How does a WebSocket connection begin?',
                  solution: {
                    explanation:
                      'As an ordinary HTTP request that asks to upgrade the connection. Once the server agrees, the same connection becomes a persistent, full-duplex WebSocket channel.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A chat app currently sends a new HTTP request every second to check for messages. What protocol would make it more efficient?',
                  solution: {
                    explanation:
                      'WebSocket. A persistent two-way channel lets the server push new messages instantly without the client polling repeatedly, reducing latency and overhead dramatically.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 5 — OPERATIONS AND SECURITY ───────────────────── */
    {
      level: 5,
      name: 'Operations and Security',
      focus: 'The tools to diagnose networks, the defences that protect them, and the techniques that make them fast at scale',
      accent: '#0ea5e9',
      soft: '#e3f5fd',
      topics: [
        {
          id: 'nw5-t0',
          name: 'Tools and troubleshooting',
          concepts: [
            {
              id: 'nw5-t0-c0',
              title: 'Connectivity tools: ping and traceroute',
              summary:
                'ping checks whether a host is reachable and measures round-trip time; traceroute reveals the path packets take and where delay or loss appears.',
              explanation:
                'When connectivity seems broken, two tools answer the first questions. ping sends small ICMP echo request probes to a host and times the replies, telling you whether the host is reachable and how long the round trip takes. Consistent replies with low times mean a healthy path; timeouts mean the host or path is down or filtering ICMP; high or erratic times suggest congestion or a slow link. traceroute goes further by mapping the route. It exploits the TTL field: it sends packets with TTL one, two, three and so on, and each router that decrements TTL to zero reports back, revealing the sequence of hops to the destination along with the time to each. This lets you see exactly where a path breaks or slows, distinguishing a problem near you from one deep in the network or at the destination. Together they answer is it reachable and where does the trouble start, which is why they are the first reflex in almost any network diagnosis.',
              analogy:
                'ping is knocking on a door to see if anyone answers and how quickly. traceroute is following the delivery route stop by stop to find exactly where a parcel got stuck.',
              keyPoints: [
                'ping tests reachability and measures round-trip time with ICMP echoes.',
                'Timeouts suggest the host or path is down or filtering ICMP.',
                'traceroute maps the hop-by-hop path by manipulating the TTL field.',
                'Together they reveal whether and where connectivity fails.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'ping -c 4 example.com',
                  'traceroute example.com',
                  '# ping shows reachability and times; traceroute lists each hop',
                ],
                explanation: 'ping confirms a host answers and how fast; traceroute lists the routers along the way so you can spot where delay or loss begins.',
              },
              commonMistakes: [
                'Concluding a host is down when it merely filters ICMP, which ping relies on.',
                'Reading high latency on intermediate traceroute hops as a fault when only the final hop matters most.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does traceroute exploit to discover each hop along a path?',
                  hint: 'A field that decrements at every router.',
                  solution: {
                    explanation:
                      'The TTL field. By sending packets with increasing TTL values, each router along the path decrements TTL to zero in turn and reports back, revealing the hops one by one.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'ping to a server times out, but you can load other websites fine. What does this suggest?',
                  solution: {
                    explanation:
                      'The problem is specific to that server or its path, not your general connectivity. The server may be down, overloaded, or simply filtering ICMP so it does not answer ping while still serving web traffic.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does a low and consistent ping round-trip time indicate?',
                  solution: { explanation: 'A healthy, low-latency path to the host with little congestion. The host is reachable and responding promptly.' },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/internet-control-message-protocol-icmp/',
            },
            {
              id: 'nw5-t0-c1',
              title: 'Inspection tools: dig, ss, curl and tcpdump',
              summary:
                'Beyond connectivity, these tools inspect specific layers: dig for DNS, ss for sockets, curl for HTTP exchanges, and tcpdump for raw packets.',
              explanation:
                'Different problems live at different layers, and each has a sharp tool. dig queries DNS directly, showing exactly what records resolve and from which server, which separates a name-resolution failure from a connection failure. ss (the modern replacement for netstat) lists active sockets and listening ports, answering which programs are connected or waiting for connections and on which ports. curl makes HTTP requests from the command line and can print the full request and response including headers and status codes, ideal for testing an API or seeing why a page misbehaves without a browser in the way. tcpdump captures raw packets off an interface so you can see the actual traffic, useful for deep diagnosis when higher-level tools are not enough, though it requires care and privileges. Choosing the right tool depends on which layer you suspect: dig for naming, ss for local connections and ports, curl for the application exchange, tcpdump when you need to see the packets themselves.',
              analogy:
                'These tools are a mechanic\'s diagnostic set: dig reads the address book, ss checks which lines are open, curl test-drives the application, and tcpdump is the stethoscope on the raw wire.',
              keyPoints: [
                'dig queries DNS to see exactly what names resolve to and from where.',
                'ss lists active sockets and listening ports, replacing netstat.',
                'curl sends HTTP requests and shows full responses and headers.',
                'tcpdump captures raw packets for deep, low-level inspection.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'dig example.com',
                  'ss -tlnp',
                  'curl -I https://example.com',
                  'sudo tcpdump -i any port 443',
                ],
                explanation: 'Each command targets a layer: DNS resolution, listening sockets, HTTP response headers, and raw packets on a port.',
              },
              commonMistakes: [
                'Reaching for tcpdump first when a simple dig or curl would isolate the layer faster.',
                'Forgetting curl -I shows only headers; omit it to see the body too.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which tool would you use to check whether a domain name resolves correctly?',
                  hint: 'It targets the DNS layer.',
                  solution: {
                    explanation:
                      'dig. It queries DNS directly and shows the records returned and the responding server, isolating name-resolution problems from connection problems.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does ss show that helps with troubleshooting?',
                  solution: { explanation: 'Active sockets and listening ports, revealing which programs are connected or waiting for connections and on which ports. It is the modern replacement for netstat.' },
                },
                {
                  type: 'predict',
                  prompt: 'A page works in curl with a 200 status but fails in the browser. What does that tell you?',
                  solution: {
                    explanation:
                      'The server and network path are fine and the resource is served correctly, so the problem is likely client-side: browser caching, cookies, scripts, or an extension, rather than connectivity or the server.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
            },
            {
              id: 'nw5-t0-c2',
              title: 'A layered troubleshooting method',
              summary:
                'Effective troubleshooting works through the layers systematically, often bottom-up, isolating where a problem lives instead of guessing.',
              explanation:
                'The fastest way to fix a network problem is to use the layer model as a checklist rather than poke at random. A common approach works from the bottom up. Start at the physical layer: is the cable plugged in, the WiFi connected, the interface up? Next the link and network layers: does the device have a valid IP address and gateway, and can it ping the gateway and then a public IP? If pinging a public IP works but names do not resolve, the problem is DNS at the application layer, which dig confirms. If names resolve but a site fails, test the application exchange with curl. By moving one layer at a time you turn a vague the Internet is broken into a precise statement like DNS is failing, which points straight at the fix. The opposite, top-down, approach also works and is sometimes faster when the symptom is clearly application-level. The discipline is what matters: change one thing, test, and narrow down, rather than changing many settings at once and losing track of cause and effect.',
              analogy:
                'It is like diagnosing why a lamp will not light: check the bulb, then the switch, then the socket, then the fuse box — one layer at a time instead of replacing everything blindly.',
              keyPoints: [
                'Use the layer model as a checklist instead of guessing.',
                'Bottom-up: physical, then IP and gateway, then DNS, then the application.',
                'Each layer has a confirming tool: ping, dig, curl and so on.',
                'Change one thing at a time and test to keep cause and effect clear.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  P[Physical link up] --> IP[Valid IP and gateway]',
                  '  IP --> Reach[Ping a public IP]',
                  '  Reach --> DNS[Names resolve with dig]',
                  '  DNS --> App[Application works with curl]',
                ],
                caption: 'A bottom-up troubleshooting flow, confirming each layer before moving up to the next.',
              },
              commonMistakes: [
                'Changing many settings at once, making it impossible to know what fixed or broke things.',
                'Jumping to application fixes when the real fault is a missing IP address or dead link.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You can ping a public IP address but websites by name fail. Which layer is the problem?',
                  hint: 'Reachability works but names do not.',
                  solution: {
                    explanation:
                      'DNS, an application-layer service. Reaching an IP proves connectivity through the lower layers, so the failure is in name resolution, which dig can confirm.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why is changing one setting at a time better than changing several?',
                  solution: {
                    explanation:
                      'It preserves cause and effect: if the problem resolves you know exactly what fixed it, and if a change makes things worse you can undo just that change. Multiple simultaneous changes obscure what actually mattered.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'List a bottom-up sequence of checks for diagnosing no Internet access.',
                  solution: {
                    lines: [
                      'Is the cable or WiFi connected and interface up',
                      'Does the device have a valid IP and gateway',
                      'Can it ping the gateway then a public IP',
                      'Do names resolve with dig',
                      'Does a site respond with curl',
                    ],
                    explanation:
                      'Each step confirms one layer, so the first failing step pinpoints where the problem lives.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/',
            },
          ],
        },
        {
          id: 'nw5-t1',
          name: 'Network security',
          concepts: [
            {
              id: 'nw5-t1-c0',
              title: 'Firewalls and traffic filtering',
              summary:
                'A firewall controls which traffic may pass based on rules, forming a boundary between trusted and untrusted networks.',
              explanation:
                'A firewall is a security control that inspects traffic and allows or blocks it according to a set of rules. The simplest type is stateless packet filtering, which judges each packet on its own against criteria like source and destination address, port and protocol. More capable stateful firewalls track the state of connections, so they can allow return traffic for a connection the inside started while blocking unsolicited inbound attempts, which is far smarter. Modern next-generation firewalls go further, inspecting application-layer content and recognising specific applications. A good firewall policy follows the principle of default deny: block everything, then explicitly permit only what is needed, which minimises the attack surface. Firewalls run at network boundaries (on routers or dedicated appliances) and also on individual hosts. They are a foundational defence, though they are only one layer; they cannot stop threats that travel over allowed channels, so they work best combined with other controls.',
              analogy:
                'A firewall is like a building\'s security desk that checks everyone against a guest list, letting in only those who are expected and turning away the rest.',
              keyPoints: [
                'A firewall allows or blocks traffic according to defined rules.',
                'Stateless filtering judges each packet alone; stateful tracks connections.',
                'Default deny then explicitly permit only what is needed.',
                'Firewalls run at network boundaries and on individual hosts.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Net[Untrusted Internet] --> FW[Firewall rules]',
                  '  FW -->|allowed| Inside[Trusted network]',
                  '  FW -->|blocked| Drop[Dropped traffic]',
                ],
                caption: 'A firewall sits at the boundary, passing allowed traffic and dropping the rest.',
              },
              commonMistakes: [
                'Allowing broad rules instead of default deny, leaving an oversized attack surface.',
                'Treating a firewall as complete security; it cannot inspect what it is configured to permit.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between a stateless and a stateful firewall?',
                  hint: 'One remembers connections, one does not.',
                  solution: {
                    explanation:
                      'A stateless firewall judges each packet independently against rules; a stateful firewall tracks connection state, so it can permit return traffic for connections started inside while blocking unsolicited inbound attempts.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does the default deny principle mean?',
                  solution: { explanation: 'Block all traffic by default and then explicitly allow only what is required. This minimises the attack surface by ensuring nothing is permitted unless deliberately opened.' },
                },
                {
                  type: 'predict',
                  prompt: 'Why can a firewall fail to stop malware that arrives in an allowed web download?',
                  solution: {
                    explanation:
                      'Because the traffic uses a permitted channel (web on an allowed port). A basic firewall passes allowed traffic without inspecting its contents, so additional layers like content scanning are needed.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/security/what-is-a-firewall/',
            },
            {
              id: 'nw5-t1-c1',
              title: 'VPNs and network segmentation',
              summary:
                'A VPN creates an encrypted tunnel across an untrusted network. Segmentation and VLANs divide a network to contain threats and limit access.',
              explanation:
                'Two complementary techniques harden networks. A virtual private network (VPN) builds an encrypted tunnel between a device and a network over the public Internet, so traffic that would otherwise be exposed travels protected as if on a private link. This lets remote workers reach internal resources securely and shields data on untrusted networks like public WiFi. Segmentation tackles a different risk: a flat network where everything can reach everything else lets an attacker who breaches one machine roam freely. Splitting the network into segments, often using VLANs to logically separate devices on the same physical switch, plus rules between segments, contains a breach and enforces least privilege so each part only reaches what it must. For example, putting guest WiFi, payment systems and office computers on separate segments means a compromise in one does not expose the others. Taken together, VPNs protect traffic in transit across untrusted links while segmentation limits how far a threat can spread once inside, both reflecting the modern assumption that no single boundary is enough.',
              analogy:
                'A VPN is an armoured tunnel between two buildings across hostile ground. Segmentation is dividing a building into locked wings, so an intruder in one wing cannot wander into the others.',
              keyPoints: [
                'A VPN creates an encrypted tunnel over an untrusted network.',
                'VPNs let remote users reach internal resources and protect public WiFi traffic.',
                'Segmentation divides a network to contain breaches and enforce least privilege.',
                'VLANs logically separate devices on shared physical switches.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  R[Remote device] -->|encrypted VPN tunnel| Net[Internal network]',
                  '  Net --> Seg1[Guest segment]',
                  '  Net --> Seg2[Office segment]',
                  '  Net --> Seg3[Payment segment]',
                ],
                caption: 'A VPN protects remote access while segmentation isolates parts of the internal network from each other.',
              },
              commonMistakes: [
                'Assuming a VPN makes traffic secure end to end; it only protects the tunnelled segment.',
                'Running a flat network where one compromised device can reach everything.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does a VPN provide when you use public WiFi?',
                  hint: 'Think about who can read your traffic.',
                  solution: {
                    explanation:
                      'An encrypted tunnel, so others on the same untrusted network cannot read or tamper with your traffic. It protects data in transit across the public link.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How does network segmentation limit the damage of a breach?',
                  solution: {
                    explanation:
                      'By dividing the network into isolated segments with rules between them, a compromise in one segment cannot freely reach the others, containing the attacker and enforcing least privilege.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A company puts guest WiFi on the same segment as its payment systems. Why is that risky?',
                  solution: {
                    explanation:
                      'A compromised guest device could reach the payment systems directly. Separate segments would isolate guests so a breach there cannot touch sensitive systems.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/access-management/what-is-a-vpn/',
            },
            {
              id: 'nw5-t1-c2',
              title: 'Common attacks: DDoS, MITM and spoofing',
              summary:
                'DDoS overwhelms a target with traffic, MITM intercepts a conversation, and spoofing forges identity. Knowing them guides the right defences.',
              explanation:
                'Several attack patterns recur across networks. A distributed denial-of-service (DDoS) attack floods a target with traffic from many sources, often a botnet, to exhaust its bandwidth or resources so legitimate users cannot get through; defences include traffic scrubbing, rate limiting and large absorbing networks. A man-in-the-middle (MITM) attack secretly inserts the attacker between two parties so they can read or alter the conversation; this is exactly what TLS prevents through encryption and certificate verification, which is why HTTPS and checking certificate warnings matter. Spoofing means forging a source identity, such as a fake source IP address, a forged ARP reply to redirect local traffic, or a forged sender to make email look legitimate; defences include filtering, authentication, and email verification with SPF, DKIM and DMARC. These attacks map cleanly onto the concepts already covered: DDoS abuses the lack of inherent rate limits, MITM abuses unauthenticated channels, and spoofing abuses unauthenticated identities. Understanding the mechanism is what makes the corresponding defence obvious rather than arbitrary.',
              analogy:
                'DDoS is a mob jamming a shop\'s doorway so real customers cannot enter. MITM is someone secretly relaying and editing letters between two people. Spoofing is forging the return address on an envelope.',
              keyPoints: [
                'DDoS floods a target with traffic to deny service to real users.',
                'MITM inserts an attacker into a conversation to read or alter it.',
                'Spoofing forges a source identity such as IP, ARP or email sender.',
                'TLS defends against MITM; authentication and filtering counter spoofing.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Bots[Many sources] -->|flood| Target[Victim service]',
                  '  Attacker[Attacker] -->|intercepts| Channel[Conversation]',
                  '  Forge[Forged identity] -->|deceives| Trust[Trusting victim]',
                ],
                caption: 'Three attack shapes: flooding for DDoS, interception for MITM, and forged identity for spoofing.',
              },
              commonMistakes: [
                'Ignoring TLS certificate warnings, which is exactly the opening a MITM attack needs.',
                'Believing a single defence stops all three; each abuses a different weakness.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which protocol primarily defends against man-in-the-middle attacks on web traffic, and how?',
                  hint: 'It both encrypts and verifies identity.',
                  solution: {
                    explanation:
                      'TLS (HTTPS). It encrypts the conversation so an interceptor cannot read it and verifies the servers certificate so the client knows it is talking to the genuine server, not an impostor.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the goal of a DDoS attack?',
                  solution: { explanation: 'To overwhelm a target with traffic from many sources so it exhausts bandwidth or resources and can no longer serve legitimate users, denying them service.' },
                },
                {
                  type: 'predict',
                  prompt: 'How could email spoofing be reduced for a domain?',
                  solution: {
                    explanation:
                      'By publishing and enforcing email authentication records: SPF lists authorised senders, DKIM signs messages, and DMARC tells receivers how to handle mail that fails, making forged senders detectable.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/',
            },
          ],
        },
        {
          id: 'nw5-t2',
          name: 'Performance and scale',
          concepts: [
            {
              id: 'nw5-t2-c0',
              title: 'Load balancers and reverse proxies',
              summary:
                'A load balancer spreads traffic across many servers for scale and resilience. A reverse proxy fronts servers to add features like TLS termination and caching.',
              explanation:
                'No single server can handle unlimited load, so large systems run many identical servers behind a load balancer that distributes incoming requests across them. This provides horizontal scale, since adding servers adds capacity, and resilience, since the balancer can stop sending traffic to a server that fails its health checks. Balancing can work at the transport layer (by connection) or the application layer (by inspecting HTTP), and uses strategies like round robin or least connections. A reverse proxy is a related component that sits in front of one or more servers and handles requests on their behalf. It can terminate TLS so backends do not each manage certificates, cache responses to reduce load, compress content, and hide the internal structure from clients. In practice these roles often overlap: a single component may both balance load and act as a reverse proxy. Both improve scalability, availability and manageability, and they are a cornerstone of how modern web services stay fast under heavy and uneven demand.',
              analogy:
                'A load balancer is the host at a busy restaurant directing arrivals to whichever table is free. A reverse proxy is the front desk that handles greetings, coats and bills so the kitchen can focus on cooking.',
              keyPoints: [
                'A load balancer spreads requests across many servers for scale and resilience.',
                'Health checks let it route around failed servers automatically.',
                'A reverse proxy fronts servers to terminate TLS, cache and compress.',
                'One component often performs both load balancing and reverse proxy roles.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  C[Clients] --> LB[Load balancer]',
                  '  LB --> S1[Server one]',
                  '  LB --> S2[Server two]',
                  '  LB --> S3[Server three]',
                ],
                caption: 'A load balancer distributes incoming requests across a pool of identical servers.',
              },
              commonMistakes: [
                'Adding servers without a load balancer, so traffic cannot be spread or failed over.',
                'Confusing a forward proxy (for clients) with a reverse proxy (for servers).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does a load balancer improve resilience, not just capacity?',
                  hint: 'Think about what it does when a server fails.',
                  solution: {
                    explanation:
                      'It uses health checks to detect failed servers and stops sending them traffic, routing requests only to healthy servers so the service stays available despite individual failures.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name two functions a reverse proxy commonly provides.',
                  solution: { explanation: 'It can terminate TLS, cache responses, compress content, and hide the internal server structure. Any two of these are correct.' },
                },
                {
                  type: 'predict',
                  prompt: 'A service is slow under heavy load on a single server. How does adding a load balancer with more servers help?',
                  solution: {
                    explanation:
                      'It spreads requests across multiple servers, so each handles a fraction of the load. This horizontal scaling raises total capacity and reduces per-server strain, improving response times.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/performance/what-is-load-balancing/',
            },
            {
              id: 'nw5-t2-c1',
              title: 'CDNs and caching',
              summary:
                'A CDN serves content from servers near users, and caching stores copies of responses so they can be returned faster without recomputing.',
              explanation:
                'Two related ideas make the Web feel fast: caching and content delivery networks. Caching stores a copy of a response so future requests can be served from the copy instead of regenerating or refetching it, which cuts both latency and load. Caches exist everywhere, in the browser, in proxies, and on servers, and HTTP headers like Cache-Control govern what may be cached and for how long. A content delivery network (CDN) applies this geographically: it operates many edge servers spread around the world and caches a site\'s static content close to users, so a visitor is served from a nearby edge rather than a distant origin. This dramatically lowers latency because distance is a major component of delay, reduces load on the origin, and adds resilience and DDoS absorption because the distributed network soaks up traffic. CDNs are especially effective for static assets like images, scripts and videos, and increasingly cache dynamic content too. Together, caching and CDNs are among the highest-impact performance tools available, often improving speed more than raw bandwidth upgrades.',
              analogy:
                'A CDN is like a chain of local warehouses: instead of shipping every order from one distant factory, popular items are stocked near customers so delivery is quick. Caching is keeping the most-requested items on the front shelf.',
              keyPoints: [
                'Caching stores response copies to serve future requests faster.',
                'Cache-Control headers govern what is cached and for how long.',
                'A CDN caches content on edge servers close to users worldwide.',
                'CDNs cut latency, offload the origin and absorb traffic spikes.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[User] --> Edge[Nearby CDN edge]',
                  '  Edge -->|cache hit| U',
                  '  Edge -->|cache miss| Origin[Origin server]',
                ],
                caption: 'A CDN serves cached content from a nearby edge, fetching from the origin only on a cache miss.',
              },
              commonMistakes: [
                'Caching content that changes often without sensible expiry, serving stale data.',
                'Assuming a CDN only helps bandwidth; its biggest win is usually lower latency from proximity.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why does serving content from a nearby CDN edge reduce latency?',
                  hint: 'Distance is a big part of delay.',
                  solution: {
                    explanation:
                      'Because physical distance is a major component of latency. An edge server close to the user means data travels far less and through fewer hops than from a distant origin, so responses arrive faster.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What happens on a CDN cache miss?',
                  solution: { explanation: 'The edge server does not have a fresh copy, so it fetches the content from the origin server, serves it to the user, and typically caches it for subsequent requests.' },
                },
                {
                  type: 'predict',
                  prompt: 'Besides speed, name a security benefit a CDN can provide.',
                  solution: {
                    explanation:
                      'Its large distributed network can absorb and mitigate DDoS traffic, shielding the origin. It also hides the origin and can add protections like a web application firewall at the edge.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/',
            },
            {
              id: 'nw5-t2-c2',
              title: 'QoS and network observability',
              summary:
                'Quality of Service prioritises important traffic when capacity is limited, and observability uses metrics and monitoring to understand network health.',
              explanation:
                'When demand exceeds capacity, not all traffic is equally urgent, and Quality of Service (QoS) lets a network prioritise. By classifying traffic and giving sensitive flows like voice and video calls priority over bulk transfers, QoS keeps latency low for what matters even under congestion, while best-effort traffic waits. It is essential where delay or jitter would ruin the experience, such as real-time communication on a shared link. The complementary discipline is observability: you cannot manage what you cannot see, so operators collect metrics like throughput, latency, packet loss and error rates, watch interface and device health, and analyse traffic flows to spot problems before users do. Logs, metrics dashboards and flow records together reveal trends, capacity limits and anomalies that might indicate a fault or an attack. Good observability turns troubleshooting from guesswork into evidence, and combined with QoS it lets a network both perform well under pressure and be understood and improved over time. These operational practices are what keep large networks reliable rather than merely functional on a good day.',
              analogy:
                'QoS is an ambulance lane that lets emergency vehicles through congested traffic. Observability is the city\'s traffic-camera network showing where jams form so planners can respond.',
              keyPoints: [
                'QoS classifies and prioritises traffic when capacity is limited.',
                'It protects latency-sensitive flows like voice and video under congestion.',
                'Observability collects metrics like latency, loss and throughput.',
                'Logs, metrics and flow data reveal faults, capacity limits and anomalies.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Traffic[Mixed traffic] --> Classify[Classify by priority]',
                  '  Classify --> High[Voice and video first]',
                  '  Classify --> Low[Bulk transfers wait]',
                  '  Monitor[Observability metrics] --> Insight[Detect faults early]',
                ],
                caption: 'QoS prioritises urgent traffic during congestion while observability surfaces the metrics that reveal network health.',
              },
              commonMistakes: [
                'Applying QoS without classifying traffic, so priorities are meaningless.',
                'Monitoring only uptime while ignoring latency, loss and trend data that predict problems.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'When is Quality of Service most valuable?',
                  hint: 'Think about congestion and urgency.',
                  solution: {
                    explanation:
                      'When demand exceeds capacity and traffic differs in urgency. QoS then prioritises latency-sensitive flows like voice and video so they stay smooth while less urgent bulk traffic waits.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name three metrics worth monitoring for network observability.',
                  solution: { explanation: 'Latency, packet loss and throughput are core ones; error rates and interface or device health are also valuable. Together they reveal performance and emerging faults.' },
                },
                {
                  type: 'predict',
                  prompt: 'Without QoS, what tends to happen to a video call when a shared link becomes congested?',
                  solution: {
                    explanation:
                      'The call competes equally with bulk traffic, so it suffers increased latency, jitter and packet loss, degrading audio and video quality. QoS would prioritise the call to keep it smooth.',
                  },
                },
              ],
              docs: 'https://www.cloudflare.com/learning/network-layer/what-is-quality-of-service-qos/',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
