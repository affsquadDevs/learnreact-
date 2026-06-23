// AWS Certified Advanced Networking – Specialty — course content.
// Deep, structured preparation for the AWS Certified Advanced Networking – Specialty
// (ANS-C01) exam, organised into the four official exam domains. Factual material
// (service names and what they do) is rewritten in our own words for self-study;
// diagrams are our own Mermaid creations. Not affiliated with or endorsed by AWS.
//
// Exam domains & weightings (ANS-C01):
//   1. Network Design ................................. 30%
//   2. Network Implementation ......................... 26%
//   3. Network Management and Operation ............... 20%
//   4. Network Security, Compliance, and Governance ... 24%

const content = {
  meta: {
    title: 'AWS Certified Advanced Networking – Specialty (ANS-C01)',
    description:
      'A specialty-depth path to the AWS Certified Advanced Networking – Specialty (ANS-C01) exam: VPC and CIDR design, hybrid connectivity (Transit Gateway, Direct Connect, Site-to-Site VPN, Cloud WAN, PrivateLink), hybrid DNS with Route 53, content delivery and edge networking, load balancing, network performance, automation, monitoring and troubleshooting, and end-to-end network security and governance — with diagrams, config snippets, quizzes and hands-on tasks.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────────── DOMAIN 1 — NETWORK DESIGN (30%) ───────────────────────── */
    {
      level: 1,
      name: 'Network Design',
      focus: 'Designing VPCs, IP addressing, multi-account/multi-Region connectivity, hybrid links and DNS architectures (Domain 1 · 30%)',
      accent: '#2d6bff',
      soft: '#eaf0ff',
      topics: [
        {
          id: 'ans1-t0',
          name: 'VPC fundamentals & CIDR planning',
          concepts: [
            {
              id: 'ans1-t0-c0',
              services: [{ icon: 'vpc', label: 'Amazon VPC' }],
              title: 'VPC building blocks: CIDR, subnets, route tables, gateways',
              summary:
                'A VPC is your private virtual network in a Region. It is defined by one or more CIDR blocks and carved into subnets, each bound to one Availability Zone and steered by a route table.',
              explanation:
                'A Virtual Private Cloud (VPC) is a logically isolated section of the AWS network that you control. It is Regional — it spans every Availability Zone in its Region — and is created from an IPv4 CIDR block between /16 (65,536 addresses) and /28 (16 addresses). You then divide that space into subnets, and each subnet lives in exactly one AZ. A subnet is "public" only because its route table sends 0.0.0.0/0 to an internet gateway and its instances have public/Elastic IPs; a "private" subnet routes outbound internet traffic through a NAT gateway instead. Route tables, the implicit router, security groups and network ACLs together decide what can reach what. Every VPC has a main route table (applied to any subnet you do not explicitly associate) and you can create custom route tables. AWS reserves the first four and the last IP address in every subnet (network address, VPC router, DNS, future use, and broadcast), so a /28 gives you 11 usable addresses, not 16.',
              analogy:
                'Think of the VPC as a private office building you lease in one city (the Region). Floors are Availability Zones; the rooms you partition off are subnets. The building directory (route table) tells visitors which door leads outside (internet gateway) and which leads to the loading dock that only sends parcels out but never lets strangers in (NAT gateway).',
              keyPoints: [
                'VPC is Regional and spans all AZs; a subnet is bound to exactly one AZ.',
                'IPv4 VPC CIDR ranges from /16 (max) to /28 (min); you can add secondary CIDR blocks later.',
                'AWS reserves 5 IPs per subnet (first four + last), so usable = block size minus 5.',
                'Public subnet = route to an internet gateway; private subnet = route to a NAT gateway for outbound only.',
                'Main route table applies to unassociated subnets; custom route tables override per subnet.',
              ],
              commonMistakes: [
                'Forgetting that 5 addresses per subnet are reserved when sizing tight subnets.',
                'Calling a subnet "public" because it has an IGW route, while instances still lack public IPs — both are required for inbound reachability.',
                'Assuming a subnet can span multiple AZs for high availability — it cannot; you need one subnet per AZ.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  IGW[Internet Gateway] --> RTpub[Public route table<br/>0.0.0.0/0 to IGW]',
                  '  RTpub --> Spub[Public subnet AZ-a]',
                  '  Spub --> NAT[NAT Gateway]',
                  '  NAT --> RTpriv[Private route table<br/>0.0.0.0/0 to NAT]',
                  '  RTpriv --> Spriv[Private subnet AZ-b]',
                ],
                caption: 'Public subnets reach the internet directly via an internet gateway; private subnets reach out only through a NAT gateway.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How many usable host addresses does a /28 subnet provide in a VPC?',
                  hint: 'Start from 16 and remove the AWS-reserved addresses.',
                  solution: {
                    explanation: 'A /28 has 16 addresses, but AWS reserves 5 per subnet, leaving 11 usable addresses.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What single property of a subnet\'s route table makes it a "public" subnet?',
                  solution: {
                    explanation: 'A default route (0.0.0.0/0) pointing to an internet gateway. Instances also need a public or Elastic IP to be reachable from the internet.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'A subnet must hold ~500 instances. What is the smallest IPv4 subnet size you can use?',
                  solution: {
                    explanation: 'A /23 gives 512 addresses, minus 5 reserved = 507 usable. A /24 (251 usable) is too small, so /23 is the smallest fit.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/configure-your-vpc.html',
            },
            {
              id: 'ans1-t0-c1',
              services: [{ icon: 'vpc', label: 'Amazon VPC' }],
              title: 'CIDR planning for scale: avoiding overlap across accounts and Regions',
              summary:
                'Good IP planning is the foundation of a network you can grow. Allocate non-overlapping ranges per VPC, account, environment and Region so that peering, Transit Gateway, VPN and Direct Connect can route cleanly.',
              explanation:
                'Most painful AWS networking problems trace back to overlapping CIDR blocks. VPC peering and Transit Gateway both refuse to route between VPCs whose ranges overlap, and on-premises ranges must not collide with VPC ranges or your VPN/Direct Connect routes will be ambiguous. Plan from the top down: reserve a large supernet (for example 10.0.0.0/8) for all of AWS, then carve a block per Region, per environment (prod/dev/test) and per account, leaving headroom. Keep VPC CIDRs predictable and documented (an IPAM tool helps). You can attach up to five IPv4 CIDR blocks to a VPC (the secondary blocks must come from the same RFC 1918 range family as the primary and cannot overlap existing blocks or routes), which lets you grow a VPC without rebuilding it. Amazon VPC IP Address Manager (IPAM) automates allocation, tracks utilisation, and can enforce non-overlap rules organisation-wide. When ranges must overlap (for example after a merger), use private NAT to translate addresses so traffic can still flow.',
              keyPoints: [
                'Peering and Transit Gateway cannot route between overlapping CIDRs — plan non-overlap up front.',
                'Reserve a top-level supernet, then sub-allocate per Region, environment and account with headroom.',
                'A VPC supports up to 5 IPv4 CIDR blocks (1 primary + secondaries) for growth without rebuild.',
                'VPC IPAM centralises allocation, tracks usage and prevents overlap across an Organization.',
                'Overlapping ranges (e.g. after a merger) require private NAT or PrivateLink to interconnect.',
              ],
              commonMistakes: [
                'Reusing 10.0.0.0/16 in every VPC, then discovering you cannot peer or attach them to one Transit Gateway.',
                'Choosing a VPC range that overlaps the on-premises network, breaking VPN/Direct Connect routing.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  S[10.0.0.0/8 supernet] --> R1[us-east-1<br/>10.0.0.0/12]',
                  '  S --> R2[eu-west-1<br/>10.16.0.0/12]',
                  '  R1 --> P[Prod VPC<br/>10.0.0.0/16]',
                  '  R1 --> D[Dev VPC<br/>10.1.0.0/16]',
                ],
                caption: 'Top-down CIDR allocation keeps every VPC, Region and environment in its own non-overlapping slice.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Two VPCs both use 10.0.0.0/16. Can you peer them or attach both to one Transit Gateway and route between them?',
                  solution: {
                    explanation: 'No — overlapping CIDR blocks cannot be routed between by VPC peering or Transit Gateway. You would need to re-IP one VPC or use private NAT/PrivateLink.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which AWS service centrally plans and enforces non-overlapping IP allocations across many accounts and Regions?',
                  solution: { explanation: 'Amazon VPC IP Address Manager (IPAM).' },
                },
                {
                  type: 'predict',
                  prompt: 'A company acquires another with an identical 10.0.0.0/16 VPC and must let a few services talk to each other. What design avoids re-IPing everything?',
                  solution: {
                    explanation: 'Expose the needed services through AWS PrivateLink (interface endpoints) or use private NAT, both of which work across overlapping address space because traffic is presented on a distinct, non-overlapping address.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/ipam/what-it-is-ipam.html',
            },
            {
              id: 'ans1-t0-c2',
              services: [{ icon: 'vpc', label: 'Amazon VPC' }],
              title: 'IPv6 in the VPC: dual-stack, egress-only gateways and addressing',
              summary:
                'AWS VPCs can run dual-stack (IPv4 + IPv6). IPv6 addresses are globally unique and publicly routable by default, so "private" outbound IPv6 uses an egress-only internet gateway instead of NAT.',
              explanation:
                'A VPC can be associated with an Amazon-provided or your own (BYOIP) IPv6 /56 block, and each subnet gets a /64. IPv6 changes a few habits. There is no NAT for IPv6 because every address is globally unique and there is no shortage to conserve — so to give instances outbound-only internet access (the IPv6 equivalent of a private subnet) you use an egress-only internet gateway, which allows outbound IPv6 and the return traffic but blocks unsolicited inbound. A regular internet gateway handles inbound and outbound IPv6 for public workloads. Security groups and network ACLs need explicit IPv6 rules (::/0) in addition to IPv4 rules; an IPv4-only rule will not match IPv6 traffic. Many deployments run dual-stack so clients can use either protocol, but you can also build IPv6-only subnets where IPv4 addresses are scarce. DNS64 plus NAT64 on a NAT gateway lets IPv6-only workloads reach IPv4-only destinations.',
              keyPoints: [
                'VPC IPv6 uses an Amazon-provided or BYOIP /56; each subnet gets a /64.',
                'No NAT for IPv6 — use an egress-only internet gateway for outbound-only access.',
                'IPv6 addresses are globally unique and routable, so design security groups/NACLs for ::/0 explicitly.',
                'Dual-stack subnets serve both protocols; IPv6-only subnets conserve scarce IPv4 space.',
                'DNS64 + NAT64 (on a NAT gateway) lets IPv6-only hosts reach IPv4-only services.',
              ],
              commonMistakes: [
                'Adding a NAT gateway expecting it to provide "private" IPv6 — IPv6 needs an egress-only internet gateway.',
                'Writing only IPv4 security-group rules and wondering why IPv6 traffic is blocked (or wide open).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which gateway gives IPv6 instances outbound internet access while blocking unsolicited inbound connections?',
                  solution: { explanation: 'An egress-only internet gateway — the IPv6 analogue of a NAT gateway for the private-subnet pattern.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is there no NAT gateway path for IPv6 traffic?',
                  solution: {
                    explanation: 'IPv6 addresses are globally unique and publicly routable, so there is no need to translate/conserve addresses. Outbound-only privacy is provided by the egress-only internet gateway instead.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html',
            },
          ],
        },
        {
          id: 'ans1-t1',
          name: 'VPC-to-VPC connectivity',
          concepts: [
            {
              id: 'ans1-t1-c0',
              services: [{ icon: 'vpc', label: 'VPC Peering' }],
              title: 'VPC peering: simple, non-transitive one-to-one links',
              summary:
                'VPC peering creates a private, one-to-one connection between two VPCs (same or different account/Region). It is cheap and low-latency but does not scale — peering is non-transitive.',
              explanation:
                'A VPC peering connection privately routes traffic between two VPCs using AWS\'s backbone — no gateways, VPN appliances or single points of failure, and there are no bandwidth bottlenecks introduced by the peering itself. You request a peering from one VPC, the owner of the other accepts it, then both sides add routes pointing the peer\'s CIDR at the peering connection and adjust security groups. The catch is that peering is non-transitive: if VPC A peers with B and B peers with C, A still cannot reach C through B. Connecting n VPCs in a full mesh needs n*(n-1)/2 peering connections, which explodes quickly (10 VPCs = 45 links). Peering also requires non-overlapping CIDRs and cannot route to a peer\'s internet gateway or NAT. For a handful of VPCs that need direct links, peering is ideal; beyond that, a Transit Gateway hub is the right tool.',
              keyPoints: [
                'Peering is private, one-to-one, over the AWS backbone; works cross-account and cross-Region.',
                'Non-transitive: traffic cannot hop through an intermediary VPC.',
                'Full mesh of n VPCs needs n*(n-1)/2 connections — does not scale.',
                'Requires non-overlapping CIDRs; both sides must add routes and open security groups.',
                'Cannot use a peer\'s internet gateway, NAT, or VPC endpoints (edge-to-edge routing is disallowed).',
              ],
              commonMistakes: [
                'Expecting transitive routing through a peered VPC.',
                'Adding routes on only one side of the peering connection.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  A[VPC A] --- B[VPC B]',
                  '  B --- C[VPC C]',
                  '  A -. no transit .- C',
                ],
                caption: 'Peering is non-transitive: A reaches B and B reaches C, but A cannot reach C through B.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'VPC A peers with VPC B, and VPC B peers with VPC C. Can instances in A reach instances in C?',
                  solution: { explanation: 'No — VPC peering is non-transitive. A would need a direct peering with C, or all three should attach to a Transit Gateway.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You need to fully mesh 6 VPCs with peering. How many peering connections are required?',
                  solution: { explanation: '6*5/2 = 15 peering connections. This O(n^2) growth is why a Transit Gateway hub is preferred at scale.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html',
            },
            {
              id: 'ans1-t1-c1',
              services: [{ icon: 'vpc', label: 'AWS Transit Gateway' }],
              title: 'Transit Gateway: the regional network hub',
              summary:
                'A Transit Gateway is a regional hub that connects thousands of VPCs, VPNs and Direct Connect gateways through a single attachment model, with route tables that control which attachments can talk to which.',
              explanation:
                'AWS Transit Gateway (TGW) replaces the peering mesh with a hub-and-spoke model. Each VPC, Site-to-Site VPN, Direct Connect gateway or peered TGW connects via an attachment, and a TGW can hold thousands of them. Unlike VPC peering, a Transit Gateway is transitive — a packet can arrive on one attachment and leave on another. You control reachability with TGW route tables: each attachment is associated with one route table (which decides where its traffic can go) and propagates its routes into one or more route tables (which decides who can reach it). This lets you build segmentation patterns — for example a "shared services" route table that every spoke can reach, plus isolated route tables that keep dev and prod from talking. A TGW lives in one Region; to connect Regions you create an inter-Region TGW peering attachment, which uses the AWS backbone with encryption. Bandwidth is up to 50 Gbps per VPC attachment. Appliance mode keeps flows symmetric when traffic is inspected by a firewall in a multi-AZ design.',
              analogy:
                'A Transit Gateway is an airport hub. Instead of flying every city pair directly (peering mesh), all flights route through the hub. Route tables are the departure boards deciding which gates connect to which.',
              keyPoints: [
                'TGW is a transitive regional hub: traffic can transit from one attachment to another.',
                'Attachment types: VPC, Site-to-Site VPN, Direct Connect gateway, TGW peering, Connect (SD-WAN).',
                'TGW route tables control segmentation via association (where I send) and propagation (who reaches me).',
                'Inter-Region connectivity uses encrypted TGW peering over the AWS backbone.',
                'Up to ~50 Gbps per VPC attachment; enable appliance mode for symmetric inspection flows.',
              ],
              commonMistakes: [
                'Forgetting to add a route in the VPC subnet route table pointing the remote CIDR to the TGW attachment — TGW routing alone is not enough.',
                'Assuming one TGW spans Regions; you need a TGW per Region connected by peering.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  TGW{Transit Gateway}',
                  '  V1[VPC Prod] --- TGW',
                  '  V2[VPC Dev] --- TGW',
                  '  V3[Shared Services VPC] --- TGW',
                  '  VPN[Site-to-Site VPN] --- TGW',
                  '  DXG[Direct Connect GW] --- TGW',
                ],
                caption: 'Transit Gateway hubs VPCs, VPN and Direct Connect together; route tables segment who can reach whom.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does a Transit Gateway differ fundamentally from VPC peering in terms of routing?',
                  solution: { explanation: 'A Transit Gateway is transitive — traffic can enter on one attachment and leave on another — whereas peering is strictly one-to-one and non-transitive.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You want dev and prod VPCs to each reach a shared-services VPC but not each other, all on one TGW. How?',
                  solution: {
                    explanation: 'Use separate TGW route tables: associate dev and prod with route tables that have a route only to the shared-services attachment (and propagate shared-services routes to both), while not propagating dev/prod routes to each other.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Connect VPCs in us-east-1 and eu-west-1 through Transit Gateways. What attachment do you need?',
                  solution: { explanation: 'A Transit Gateway in each Region, joined by an inter-Region Transit Gateway peering attachment (encrypted, over the AWS backbone).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html',
            },
            {
              id: 'ans1-t1-c2',
              services: [{ icon: 'vpc', label: 'AWS Cloud WAN' }],
              title: 'AWS Cloud WAN: managing a global network as policy',
              summary:
                'AWS Cloud WAN builds and operates a global, multi-Region network from a central dashboard using a declarative network policy, with segments that span Regions and integrate VPCs, VPNs, SD-WAN and Direct Connect.',
              explanation:
                'When a network spans many Regions and on-premises sites, stitching together per-Region Transit Gateways with peering becomes operationally heavy. AWS Cloud WAN provides a global network managed through a single policy document (JSON) that defines core network edges (one per Region), segments (logical isolation that spans Regions, similar in spirit to TGW route tables but global), and attachment/sharing rules that can be applied automatically by tags. You describe the intent — "the prod segment exists in these three Regions and may reach shared-services but not dev" — and Cloud WAN provisions and maintains the underlying connectivity. It interoperates with Transit Gateways (via TGW peering / Cloud WAN peering) so you can migrate gradually, and it offers a central dashboard plus integration with Network Manager for visualisation and metrics. Cloud WAN suits multi-Region, multi-account enterprises that want a unified, intent-based global backbone; a single TGW remains the simpler choice for a single Region.',
              keyPoints: [
                'Cloud WAN manages a global, multi-Region network from one place using a declarative policy.',
                'Core network edges are created per Region; segments provide global, cross-Region isolation.',
                'Tag-based attachment and segmentation rules automate where VPCs/VPNs land.',
                'Interoperates with Transit Gateway (peering) so you can adopt it incrementally.',
                'Best for multi-Region enterprises; a single Transit Gateway is simpler for one Region.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  POL[Network policy<br/>segments + rules] --> CWAN{Cloud WAN core}',
                  '  CWAN --> E1[Edge us-east-1]',
                  '  CWAN --> E2[Edge eu-west-1]',
                  '  E1 --> VA[VPCs + VPN]',
                  '  E2 --> VB[VPCs + Direct Connect]',
                ],
                caption: 'Cloud WAN turns a multi-Region network into a single policy with per-Region edges and global segments.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A company runs VPCs in five Regions and wants a single, policy-driven global backbone with consistent segmentation. Which service fits best?',
                  solution: { explanation: 'AWS Cloud WAN — it manages a global multi-Region network from one declarative policy with cross-Region segments.' },
                },
                {
                  type: 'predict',
                  prompt: 'A team already runs Transit Gateways per Region but wants to centralise management with Cloud WAN. Must they rebuild everything?',
                  solution: { explanation: 'No — Cloud WAN peers with existing Transit Gateways, allowing an incremental migration rather than a rebuild.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/network-manager/latest/cloudwan/what-is-cloudwan.html',
            },
          ],
        },
        {
          id: 'ans1-t2',
          name: 'Hybrid connectivity design',
          concepts: [
            {
              id: 'ans1-t2-c0',
              services: [{ icon: 'directconnect', label: 'AWS Direct Connect' }],
              title: 'Direct Connect: dedicated private bandwidth to AWS',
              summary:
                'AWS Direct Connect provides a dedicated, private physical link from your data centre to AWS for consistent low latency and high bandwidth, terminating at a Direct Connect location.',
              explanation:
                'Direct Connect (DX) gives you a private network connection between your premises and AWS that bypasses the public internet, delivering predictable latency and throughput. You order a dedicated connection (a whole physical port — 1, 10, or 100 Gbps) or a hosted connection (a slice of a partner\'s port, from 50 Mbps up) at a Direct Connect location, then cross-connect your router to AWS. On top of the physical link you create virtual interfaces (VIFs). DX alone is not redundant — a single connection is a single point of failure — so production designs use two connections at two DX locations, often with a VPN as a cheaper backup. Direct Connect lowers data-transfer cost compared with internet egress and is the choice when you need stable performance for large or latency-sensitive flows. Note DX does not encrypt traffic by default; layer a VPN over it or use MACsec for encryption.',
              keyPoints: [
                'Dedicated private link bypassing the internet → consistent latency and bandwidth.',
                'Dedicated connection = a full port (1/10/100 Gbps); hosted connection = a partner-provided slice.',
                'A single DX is not redundant — use 2 connections at 2 locations, optionally with VPN backup.',
                'Lowers data-transfer egress cost versus public internet.',
                'Not encrypted by default — add a VPN over DX or enable MACsec.',
              ],
              commonMistakes: [
                'Treating one Direct Connect as highly available — it is a single point of failure without a second link.',
                'Assuming DX traffic is encrypted; it is private but not encrypted unless you add VPN/MACsec.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  DC[Customer data centre] --> CR[Customer router]',
                  '  CR --> DXL[Direct Connect location<br/>cross-connect]',
                  '  DXL --> AWS[(AWS Region)]',
                  '  CR -. VPN backup over internet .-> AWS',
                ],
                caption: 'Direct Connect provides a private link via a DX location; a VPN is a common lower-cost backup path.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A workload needs predictable low latency and high throughput to AWS that the public internet cannot guarantee. Which service?',
                  solution: { explanation: 'AWS Direct Connect — a dedicated private connection with consistent performance.' },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you make a Direct Connect design resilient and encrypted on a budget?',
                  solution: {
                    explanation: 'Use two Direct Connect connections at two DX locations for resilience, and run an IPsec VPN over the DX (or enable MACsec) for encryption. A VPN can also serve as a cheaper backup path.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html',
            },
            {
              id: 'ans1-t2-c1',
              services: [{ icon: 'directconnect', label: 'AWS Direct Connect' }],
              title: 'Direct Connect VIFs, LAG, DX Gateway and MACsec',
              summary:
                'Virtual interfaces carve a DX link into private, public and transit paths; LAG bundles ports for bandwidth/resilience; a Direct Connect gateway extends reach to many VPCs/Regions; MACsec encrypts the link.',
              explanation:
                'A Direct Connect connection carries one or more virtual interfaces (VIFs), each a tagged VLAN running BGP. A private VIF reaches a single VPC (via a virtual private gateway) for private (RFC 1918) addresses. A transit VIF connects to a Direct Connect gateway associated with one or more Transit Gateways, so a single DX can reach many VPCs across Regions. A public VIF reaches AWS public services (S3, public endpoints) over private DX using public IPs. A Link Aggregation Group (LAG) bundles multiple physical connections (same speed, same location) into one logical higher-bandwidth, more resilient link. A Direct Connect gateway is a global resource that lets one DX connect to multiple VPCs in multiple Regions (it does not enable VPC-to-VPC transit by itself — pair it with a Transit Gateway for that). MACsec provides Layer-2 line-rate encryption on supported 10/100 Gbps connections, addressing DX\'s lack of native encryption.',
              keyPoints: [
                'Private VIF → one VPC via a virtual private gateway; uses BGP and private IPs.',
                'Transit VIF → a Direct Connect gateway attached to Transit Gateway(s) for many VPCs/Regions.',
                'Public VIF → AWS public services (e.g. S3) over the private DX link using public IPs.',
                'LAG bundles same-speed, same-location ports into one logical link for bandwidth and resilience.',
                'Direct Connect gateway is global, connecting one DX to multiple VPCs/Regions; MACsec adds L2 encryption.',
              ],
              commonMistakes: [
                'Expecting a Direct Connect gateway alone to provide VPC-to-VPC routing — you need a Transit Gateway (transit VIF) for that.',
                'Trying to mix different port speeds or locations in one LAG — all members must match speed and location.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  DX[DX connection] --> PVIF[Private VIF] --> VGW[Virtual private gateway] --> V1[VPC]',
                  '  DX --> TVIF[Transit VIF] --> DXG[Direct Connect GW] --> TGW{Transit Gateway} --> V2[Many VPCs]',
                  '  DX --> PUB[Public VIF] --> S3[AWS public services]',
                ],
                caption: 'VIF types determine what a Direct Connect link reaches: one VPC, many VPCs via TGW, or AWS public services.',
              },
              code: {
                language: 'text',
                lines: [
                  'Private VIF  -> single VPC (virtual private gateway), private IPs',
                  'Transit VIF  -> Direct Connect gateway -> Transit Gateway -> many VPCs/Regions',
                  'Public VIF   -> AWS public service endpoints (S3, DynamoDB public), public IPs',
                  'LAG          -> bundle N x same-speed ports at same location into one link',
                  'MACsec       -> line-rate L2 encryption on supported 10/100G connections',
                ],
                explanation: 'A quick reference mapping each Direct Connect construct to what it provides.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You need one Direct Connect to reach dozens of VPCs spread across two Regions. Which VIF type and constructs do you use?',
                  solution: {
                    explanation: 'A transit VIF connected to a Direct Connect gateway that is associated with a Transit Gateway in each Region. This gives many-VPC, multi-Region reach over a single DX.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which VIF lets you reach Amazon S3 public endpoints over a Direct Connect link?',
                  solution: { explanation: 'A public VIF — it advertises AWS public IP ranges over the private DX link.' },
                },
                {
                  type: 'task',
                  prompt: 'A customer wants line-rate encryption on a 100 Gbps Direct Connect. What feature provides it?',
                  solution: { explanation: 'MACsec — Layer-2 encryption supported on dedicated 10/100 Gbps connections at MACsec-capable locations.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html',
            },
            {
              id: 'ans1-t2-c2',
              services: [{ icon: 'vpc', label: 'Site-to-Site VPN' }],
              title: 'Site-to-Site VPN and choosing VPN vs Direct Connect',
              summary:
                'A Site-to-Site VPN builds encrypted IPsec tunnels over the internet between your network and AWS. It is fast to deploy and encrypted, but performance depends on the internet.',
              explanation:
                'AWS Site-to-Site VPN connects your on-premises network to AWS over the public internet using two encrypted IPsec tunnels (for redundancy) terminating on a virtual private gateway (attached to a VPC) or a Transit Gateway. Each tunnel supports up to ~1.25 Gbps; for more throughput you can use equal-cost multipath (ECMP) across multiple VPN connections on a Transit Gateway. VPN supports static routing or dynamic routing with BGP, which enables automatic failover between tunnels. Compared with Direct Connect: VPN is encrypted by default, deploys in minutes, and is inexpensive, but its latency and throughput ride on the internet and are not guaranteed. Direct Connect gives consistent, high performance and lower egress cost but takes weeks to provision and is not encrypted by default. A very common pattern is Direct Connect as primary with a Site-to-Site VPN as automatic backup, or VPN-over-DX to get both performance and encryption.',
              keyPoints: [
                'Site-to-Site VPN = two IPsec tunnels over the internet to a VGW or Transit Gateway.',
                'Encrypted by default, deploys in minutes, low cost; ~1.25 Gbps per tunnel.',
                'Use BGP for dynamic routing and automatic tunnel failover; ECMP scales throughput on TGW.',
                'Direct Connect = consistent performance + lower egress, but slower to set up and unencrypted.',
                'Common design: Direct Connect primary + VPN backup, or VPN-over-DX for performance plus encryption.',
              ],
              commonMistakes: [
                'Expecting guaranteed bandwidth/latency from a VPN — it depends on the public internet.',
                'Using static routes when you need automatic failover; BGP is required for dynamic failover between tunnels.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  CGW[Customer gateway] ==>|IPsec tunnel 1| TGW{Transit Gateway / VGW}',
                  '  CGW ==>|IPsec tunnel 2| TGW',
                  '  TGW --> VPC[VPCs]',
                ],
                caption: 'A Site-to-Site VPN provides two encrypted tunnels for redundancy between the customer gateway and AWS.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A company needs encrypted hybrid connectivity within an hour and can tolerate internet-grade performance. VPN or Direct Connect?',
                  solution: { explanation: 'Site-to-Site VPN — encrypted by default and deployable in minutes; Direct Connect takes weeks and is unencrypted by default.' },
                },
                {
                  type: 'quiz',
                  prompt: 'What enables automatic failover between the two tunnels of a Site-to-Site VPN?',
                  solution: { explanation: 'Dynamic routing with BGP. With static routes there is no automatic failover between tunnels.' },
                },
                {
                  type: 'predict',
                  prompt: 'A single VPN tunnel caps near 1.25 Gbps but the workload needs ~4 Gbps to AWS. What scales it?',
                  solution: { explanation: 'Attach multiple VPN connections to a Transit Gateway and use ECMP to load-balance across the tunnels, or move to Direct Connect for guaranteed higher bandwidth.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html',
            },
          ],
        },
        {
          id: 'ans1-t3',
          name: 'DNS architecture & private access',
          concepts: [
            {
              id: 'ans1-t3-c0',
              services: [{ icon: 'route53', label: 'Amazon Route 53' }],
              title: 'Route 53 hosted zones, record types and routing policies',
              summary:
                'Route 53 is AWS\'s authoritative DNS. Public hosted zones answer internet queries; private hosted zones answer queries inside associated VPCs. Routing policies decide which answer a query receives.',
              explanation:
                'Amazon Route 53 hosts DNS zones and resolves names with high availability. A public hosted zone serves records to the internet for a domain you own; a private hosted zone serves records only to the VPCs you associate it with, enabling internal naming that is invisible publicly. Beyond plain A/AAAA/CNAME records, Route 53 offers alias records that point to AWS resources (ALB, CloudFront, S3 website, another Route 53 record) at no query cost and can sit at the zone apex where CNAMEs cannot. The power of Route 53 is its routing policies: Simple (one answer), Weighted (split traffic by percentage, e.g. canary), Latency-based (send users to the lowest-latency Region), Failover (active/passive with health checks), Geolocation (route by user location for compliance/localisation), Geoproximity (route by geographic distance with a bias), and Multivalue answer (return several healthy records for client-side balancing). Health checks underpin failover and can monitor endpoints, other health checks, or CloudWatch alarms.',
              keyPoints: [
                'Public hosted zone = internet-facing DNS; private hosted zone = resolves only inside associated VPCs.',
                'Alias records point to AWS resources for free and work at the zone apex (CNAMEs cannot).',
                'Routing policies: Simple, Weighted, Latency, Failover, Geolocation, Geoproximity, Multivalue.',
                'Health checks drive Failover and can watch endpoints, other checks, or CloudWatch alarms.',
                'Latency-based routing optimises performance; Geolocation optimises compliance/localisation.',
              ],
              commonMistakes: [
                'Using a CNAME at the zone apex (example.com) — not allowed; use an alias record instead.',
                'Confusing Latency-based routing (performance) with Geolocation routing (user location/compliance).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Q[DNS query] --> POL{Routing policy}',
                  '  POL --> L[Latency: nearest Region]',
                  '  POL --> W[Weighted: split %]',
                  '  POL --> F[Failover: primary/secondary]',
                  '  POL --> G[Geolocation: by user location]',
                ],
                caption: 'Route 53 routing policies select which record answers each query based on latency, weight, health or location.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You want to point example.com (the zone apex) at an Application Load Balancer. Which record type do you use?',
                  solution: { explanation: 'An alias record — CNAMEs are not permitted at the zone apex, but Route 53 alias records can target an ALB there at no query cost.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Users worldwide should be sent to the AWS Region that gives them the best response time. Which routing policy?',
                  solution: { explanation: 'Latency-based routing.' },
                },
                {
                  type: 'task',
                  prompt: 'Design an active/passive DR site that fails over automatically when the primary is unhealthy. Which Route 53 features?',
                  solution: { explanation: 'A Failover routing policy with a health check on the primary endpoint; if the check fails, Route 53 returns the secondary record.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html',
            },
            {
              id: 'ans1-t3-c1',
              services: [{ icon: 'route53', label: 'Route 53 Resolver' }],
              title: 'Hybrid DNS with Route 53 Resolver endpoints',
              summary:
                'Route 53 Resolver inbound endpoints let on-premises resolvers query AWS private zones; outbound endpoints plus forwarding rules let VPC workloads resolve on-premises domains.',
              explanation:
                'Every VPC has a default Route 53 Resolver at the base of the VPC CIDR plus two (the "+2" address, e.g. 10.0.0.2). For hybrid environments you add Resolver endpoints. An inbound endpoint provides IP addresses inside your VPC that on-premises DNS servers forward queries to, so the data centre can resolve names in your private hosted zones. An outbound endpoint, together with Resolver rules, forwards queries for specified domains (for example corp.example.internal) from your VPCs to on-premises DNS servers, so cloud workloads can resolve internal names. Resolver rules can be shared across accounts with AWS Resource Access Manager so an entire Organization resolves the same hybrid names consistently. This two-endpoint pattern replaces the old approach of running EC2-based DNS forwarders and is the standard exam answer for bidirectional hybrid DNS.',
              keyPoints: [
                'Default Resolver lives at VPC base +2 (e.g. 10.0.0.2) and answers VPC DNS by default.',
                'Inbound endpoint: on-premises resolvers forward to it to resolve AWS private zones.',
                'Outbound endpoint + forwarding rules: VPCs forward chosen domains to on-premises DNS.',
                'Resolver rules can be shared org-wide via AWS RAM for consistent hybrid resolution.',
                'This replaces self-managed EC2 DNS forwarders for hybrid name resolution.',
              ],
              commonMistakes: [
                'Mixing up direction: inbound = on-prem to AWS resolution; outbound = AWS to on-prem resolution.',
                'Forgetting to associate forwarding rules with the VPCs that need to resolve the on-premises domain.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  OnPrem[On-prem DNS] -->|query AWS private zone| IN[Inbound endpoint]',
                  '  IN --> R53[(Route 53 private zone)]',
                  '  VPCw[VPC workload] -->|query corp domain| OUT[Outbound endpoint]',
                  '  OUT -->|forwarding rule| OnPrem',
                ],
                caption: 'Inbound endpoints let on-prem resolve AWS names; outbound endpoints plus rules let AWS resolve on-prem names.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'On-premises servers must resolve records in a Route 53 private hosted zone. Which Resolver endpoint do you create?',
                  solution: { explanation: 'An inbound endpoint — on-premises DNS forwards queries to its IPs inside the VPC.' },
                },
                {
                  type: 'quiz',
                  prompt: 'EC2 instances need to resolve corp.example.internal hosted by an on-premises DNS server. What do you configure?',
                  solution: { explanation: 'An outbound Resolver endpoint plus a forwarding rule for corp.example.internal pointing to the on-premises DNS, associated with the relevant VPCs.' },
                },
                {
                  type: 'task',
                  prompt: 'What address answers DNS by default inside a VPC with CIDR 10.20.0.0/16?',
                  solution: { explanation: 'The Route 53 Resolver at the base of the VPC range plus two: 10.20.0.2.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html',
            },
          ],
        },
      ],
    },

    /* ─────────────────── DOMAIN 2 — NETWORK IMPLEMENTATION (26%) ─────────────────── */
    {
      level: 2,
      name: 'Network Implementation',
      focus: 'Implementing connectivity, private service access, load balancing and edge/content-delivery solutions (Domain 2 · 26%)',
      accent: '#7c4ddb',
      soft: '#f1ebfd',
      topics: [
        {
          id: 'ans2-t0',
          name: 'Private service access',
          concepts: [
            {
              id: 'ans2-t0-c0',
              services: [{ icon: 'vpc', label: 'VPC Endpoints' }],
              title: 'Gateway vs interface VPC endpoints',
              summary:
                'VPC endpoints let resources reach AWS services privately without an internet gateway or NAT. Gateway endpoints (S3, DynamoDB) use route tables; interface endpoints use a private IP/ENI powered by PrivateLink.',
              explanation:
                'VPC endpoints keep traffic to AWS services on the AWS network rather than traversing the internet. There are two kinds. A gateway endpoint serves only Amazon S3 and DynamoDB: you add a prefix-list route to your subnet route tables, and matching traffic goes privately to the service — it is free and Region-local. An interface endpoint creates an elastic network interface with a private IP in your subnet and is backed by AWS PrivateLink; you connect to the service through that private DNS name. Interface endpoints work for most AWS services and for partner/third-party services, support security groups, and incur an hourly plus data-processing charge. Use a gateway endpoint for S3/DynamoDB when you only need them within the Region (cheapest); use an interface endpoint when you need access from on-premises (over DX/VPN), cross-VPC reach, or for services that only support PrivateLink. Enabling private DNS on an interface endpoint lets existing service hostnames resolve to the private IP transparently.',
              keyPoints: [
                'Gateway endpoint: S3 and DynamoDB only; route-table based; free; Region-local.',
                'Interface endpoint: an ENI with a private IP via PrivateLink; works for most services + partners.',
                'Interface endpoints support security groups and are reachable from on-premises over DX/VPN.',
                'Gateway endpoints are not reachable from on-premises; interface endpoints are.',
                'Enable private DNS so standard service hostnames resolve to the endpoint automatically.',
              ],
              commonMistakes: [
                'Trying to use a gateway endpoint for a service other than S3 or DynamoDB.',
                'Expecting a gateway endpoint to be reachable from on-premises — only interface endpoints are.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  RT[Subnet route table] -->|prefix list| GW[Gateway endpoint]',
                  '  GW --> S3[(Amazon S3 / DynamoDB)]',
                  '  ENI[Interface endpoint ENI<br/>private IP] -->|PrivateLink| SVC[Most AWS / partner services]',
                ],
                caption: 'Gateway endpoints route to S3/DynamoDB via the route table; interface endpoints reach services through a private ENI.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Instances in a private subnet must reach Amazon S3 without a NAT gateway, within the Region only, at no extra cost. Which endpoint?',
                  solution: { explanation: 'A gateway VPC endpoint for S3 — free, route-table based, and Region-local.' },
                },
                {
                  type: 'quiz',
                  prompt: 'On-premises servers (over Direct Connect) need private access to an AWS service. Which endpoint type works?',
                  solution: { explanation: 'An interface endpoint (PrivateLink) — gateway endpoints are not reachable from on-premises.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html',
            },
            {
              id: 'ans2-t0-c1',
              services: [{ icon: 'vpc', label: 'AWS PrivateLink' }],
              title: 'AWS PrivateLink and endpoint services',
              summary:
                'PrivateLink exposes a service in one VPC to consumers in other VPCs/accounts through interface endpoints, keeping traffic private and working even when CIDRs overlap.',
              explanation:
                'AWS PrivateLink lets a provider publish a service privately. The provider puts a Network Load Balancer (or Gateway Load Balancer) in front of the application and creates a VPC endpoint service from it. Consumers then create an interface endpoint to that service, which appears as a private IP/ENI in their own VPC; traffic flows over the AWS backbone, never the internet. Because the consumer only sees the endpoint\'s private IP — not the provider\'s VPC — PrivateLink works even when the two VPCs have overlapping CIDR blocks, which is its key advantage over peering or Transit Gateway for SaaS-style access. Connections are unidirectional (consumer to provider) and the provider can require acceptance of each consumer and restrict by account or principal. This is the standard pattern for exposing an internal microservice or a SaaS product to many customers without sharing whole networks.',
              keyPoints: [
                'Provider fronts the service with an NLB/GWLB and publishes an endpoint service.',
                'Consumers create interface endpoints; the service appears as a private IP in their VPC.',
                'Traffic stays on the AWS backbone — never the public internet.',
                'Works across overlapping CIDRs because only the endpoint IP is exposed, not the whole VPC.',
                'Unidirectional (consumer to provider); provider controls which principals may connect.',
              ],
              commonMistakes: [
                'Choosing peering/TGW to share a single service when overlapping CIDRs or many consumers make PrivateLink the right answer.',
                'Forgetting that PrivateLink connectivity is one-way from consumer to provider.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  subgraph Provider VPC',
                  '    NLB[Network Load Balancer] --> App[Service]',
                  '  end',
                  '  ES[Endpoint service] --- NLB',
                  '  subgraph Consumer VPC',
                  '    IE[Interface endpoint] --> Client[Client]',
                  '  end',
                  '  IE -->|PrivateLink| ES',
                ],
                caption: 'PrivateLink exposes a provider service to consumer VPCs via interface endpoints over the AWS backbone.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A SaaS company wants to expose one internal service to hundreds of customer VPCs without sharing networks, even if CIDRs overlap. Which solution?',
                  solution: { explanation: 'AWS PrivateLink — publish an endpoint service behind an NLB; consumers connect via interface endpoints, which works across overlapping CIDRs.' },
                },
                {
                  type: 'predict',
                  prompt: 'A provider exposes a service via PrivateLink. Can the provider initiate connections back into a consumer VPC through the same endpoint?',
                  solution: { explanation: 'No — PrivateLink connections are unidirectional, initiated by the consumer toward the provider.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html',
            },
          ],
        },
        {
          id: 'ans2-t1',
          name: 'Elastic Load Balancing',
          concepts: [
            {
              id: 'ans2-t1-c0',
              services: [{ icon: 'elb', label: 'Elastic Load Balancing' }],
              title: 'ALB, NLB and GWLB: choosing the right load balancer',
              summary:
                'Application Load Balancers operate at Layer 7 (HTTP/HTTPS) with content-based routing; Network Load Balancers operate at Layer 4 for extreme performance and static IPs; Gateway Load Balancers transparently insert security appliances at Layer 3.',
              explanation:
                'Elastic Load Balancing offers three modern types. The Application Load Balancer (ALB) works at Layer 7 and routes by URL path, host header, HTTP method, query string or source IP; it terminates TLS, integrates with WAF and Cognito authentication, and targets instances, IPs, Lambda or containers. The Network Load Balancer (NLB) works at Layer 4 (TCP/UDP/TLS), handles millions of requests per second at ultra-low latency, preserves the client source IP, and provides a static IP per AZ (and Elastic IP support) — ideal for high-throughput, latency-sensitive or non-HTTP workloads, and it can be the front for a PrivateLink endpoint service. The Gateway Load Balancer (GWLB) operates at Layer 3, transparently routing traffic through a fleet of third-party virtual appliances (firewalls, IDS/IPS) using the GENEVE protocol on port 6081 while preserving the original packet — the standard way to insert inline inspection. Choose ALB for HTTP routing, NLB for raw L4 performance/static IP, GWLB to deploy network security appliances at scale.',
              keyPoints: [
                'ALB: Layer 7, content-based routing, TLS termination, WAF/Cognito integration; HTTP/HTTPS.',
                'NLB: Layer 4 (TCP/UDP/TLS), millions of req/s, preserves source IP, static/Elastic IP per AZ.',
                'GWLB: Layer 3, transparently inserts firewall/IDS appliances via GENEVE (port 6081).',
                'NLB fronts PrivateLink endpoint services; ALB does the smart HTTP routing.',
                'Pick by layer and need: HTTP features (ALB), throughput/static IP (NLB), inline inspection (GWLB).',
              ],
              commonMistakes: [
                'Using an ALB when you need a static IP or non-HTTP protocol — that is an NLB job.',
                'Trying to do deep HTTP path routing on an NLB — Layer-7 routing belongs to the ALB.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Need{Requirement?} --> H[HTTP path/host routing] --> ALB[Application LB - L7]',
                  '  Need --> P[High throughput / static IP / UDP] --> NLB[Network LB - L4]',
                  '  Need --> I[Inline firewall/IDS] --> GWLB[Gateway LB - L3 GENEVE]',
                ],
                caption: 'Match the load balancer to the layer and feature you need.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You must route /api to one target group and /images to another based on the URL path. Which load balancer?',
                  solution: { explanation: 'An Application Load Balancer — Layer-7 content-based (path) routing.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A workload needs a static IP, UDP support and millions of requests per second at the lowest latency. Which load balancer?',
                  solution: { explanation: 'A Network Load Balancer.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You want all VPC traffic to pass transparently through a fleet of third-party firewall appliances. Which load balancer enables this?',
                  solution: { explanation: 'A Gateway Load Balancer (GWLB), using GENEVE encapsulation on port 6081.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html',
            },
            {
              id: 'ans2-t1-c1',
              services: [{ icon: 'elb', label: 'Target Groups & Health Checks' }],
              title: 'Target groups, health checks and cross-zone behaviour',
              summary:
                'A load balancer routes to a target group; health checks remove unhealthy targets; cross-zone load balancing controls whether each node can send to targets in other AZs.',
              explanation:
                'A target group is the set of registered targets (instances, IPs, Lambda functions or containers) that a listener forwards to, along with their protocol/port and health-check configuration. Health checks probe each target on a defined path/port at an interval; a target must pass the healthy threshold to receive traffic and is taken out of rotation after the unhealthy threshold. With cross-zone load balancing on, every load-balancer node spreads requests evenly across all targets in all AZs; with it off, a node only sends to targets in its own AZ. For ALB cross-zone is on by default and free; for NLB and GWLB it is off by default and, when enabled, inter-AZ data is charged. Sticky sessions (session affinity) pin a client to a target via a cookie (ALB) — useful for stateful apps but at odds with even distribution. Deregistration delay (connection draining) lets in-flight requests finish before a target is removed.',
              keyPoints: [
                'Target group = registered targets + protocol/port + health-check settings.',
                'Health checks add/remove targets based on healthy/unhealthy thresholds.',
                'Cross-zone on = even spread across all AZs; off = node serves only its own AZ.',
                'ALB cross-zone is on by default (free); NLB/GWLB off by default (inter-AZ charges when on).',
                'Sticky sessions pin clients to a target; deregistration delay drains in-flight connections.',
              ],
              commonMistakes: [
                'Assuming NLB does cross-zone by default — it does not; you must enable it (and pay inter-AZ charges).',
                'Setting a health-check path that returns 302/redirect and seeing all targets marked unhealthy.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'With cross-zone load balancing disabled on an NLB, where can a node in AZ-a send traffic?',
                  solution: { explanation: 'Only to healthy targets registered in AZ-a. Enable cross-zone to spread across all AZs (inter-AZ data charges apply).' },
                },
                {
                  type: 'task',
                  prompt: 'A stateful app stores session data on the instance and breaks when a user hits a different target. What load-balancer feature helps without re-architecting?',
                  solution: { explanation: 'Sticky sessions (session affinity) on the ALB target group, which pins a client to one target via a cookie. (Long term, externalise session state.)' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html',
            },
          ],
        },
        {
          id: 'ans2-t2',
          name: 'Content delivery & edge',
          concepts: [
            {
              id: 'ans2-t2-c0',
              services: [{ icon: 'cloudfront', label: 'Amazon CloudFront' }],
              title: 'CloudFront: caching and securing content at the edge',
              summary:
                'CloudFront is a global CDN that caches and serves content from 600+ edge locations close to users, reducing latency and offloading origins, with TLS, WAF and origin-protection features.',
              explanation:
                'Amazon CloudFront delivers content (static and dynamic) from a worldwide network of edge locations and regional edge caches. A distribution defines one or more origins (an S3 bucket, an ALB, an HTTP server, or any custom origin) and cache behaviours that map URL patterns to caching, TLS and routing rules. Caching at the edge cuts latency and origin load; cache policies and TTLs control freshness, and you can invalidate paths to purge content. CloudFront supports HTTPS with custom certificates (via ACM in us-east-1), Origin Access Control (OAC) so an S3 origin only accepts requests from your distribution, signed URLs/cookies for private content, field-level encryption, and integration with AWS WAF and Shield for protection. CloudFront Functions (lightweight, at the edge) and Lambda@Edge (heavier, at regional edge caches) let you run code to rewrite requests/responses, do header-based routing, or authenticate at the edge. Use CloudFront for cacheable web/video content and to add a security and TLS layer in front of origins.',
              keyPoints: [
                'Global CDN: edge locations + regional edge caches reduce latency and offload origins.',
                'Distribution + origins + cache behaviours control routing, caching and TLS per URL pattern.',
                'Origin Access Control locks an S3 origin to the distribution; signed URLs/cookies gate private content.',
                'Integrates with ACM (certs in us-east-1), AWS WAF and Shield for security.',
                'CloudFront Functions (edge) and Lambda@Edge (regional edge) run code on requests/responses.',
              ],
              commonMistakes: [
                'Provisioning the CloudFront ACM certificate in the wrong Region — it must be in us-east-1.',
                'Leaving an S3 origin public instead of using Origin Access Control to restrict it to CloudFront.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  User --> Edge[CloudFront edge location]',
                  '  Edge -->|cache miss| REC[Regional edge cache]',
                  '  REC --> Origin[(S3 / ALB origin)]',
                  '  Edge -->|cache hit| User',
                ],
                caption: 'CloudFront serves cache hits from the edge and only fetches from the origin on a miss.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How do you ensure an S3 origin only serves requests that come through your CloudFront distribution?',
                  solution: { explanation: 'Use Origin Access Control (OAC) and a bucket policy that allows access only from the distribution, keeping the bucket otherwise private.' },
                },
                {
                  type: 'quiz',
                  prompt: 'In which Region must an ACM certificate live to be used by a CloudFront distribution?',
                  solution: { explanation: 'us-east-1 (N. Virginia).' },
                },
                {
                  type: 'task',
                  prompt: 'You must rewrite a request header for A/B testing at the edge with minimal latency and cost. Which CloudFront feature?',
                  solution: { explanation: 'CloudFront Functions — lightweight JavaScript at the edge for simple header/URL manipulation (Lambda@Edge for heavier logic).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html',
            },
            {
              id: 'ans2-t2-c1',
              services: [{ icon: 'globalaccelerator', label: 'AWS Global Accelerator' }],
              title: 'Global Accelerator vs CloudFront',
              summary:
                'Global Accelerator gives two static anycast IPs and routes traffic over the AWS backbone to the nearest healthy endpoint across Regions — ideal for non-HTTP, TCP/UDP and fast Regional failover, complementing CloudFront\'s caching.',
              explanation:
                'AWS Global Accelerator improves availability and performance for global applications by providing two static anycast IP addresses that act as a fixed front door. Traffic enters the AWS global network at the nearest edge and travels over the AWS backbone (not the public internet) to the closest healthy endpoint — an ALB, NLB, EC2 instance or Elastic IP — in one of several Regions. It does instant, health-check-driven failover between Regions and supports traffic dials and endpoint weights for blue/green or gradual shifts. Crucially it operates at the connection (Layer 4) level and does not cache. Compare with CloudFront: CloudFront caches HTTP(S) content at the edge and is best for cacheable web and media; Global Accelerator does not cache and shines for TCP/UDP, gaming, IoT, VoIP, non-HTTP protocols, the need for static entry-point IPs, and fast multi-Region failover. They are complementary, and many designs use both.',
              keyPoints: [
                'Provides two static anycast IPs as a stable global entry point.',
                'Routes over the AWS backbone to the nearest healthy Regional endpoint (ALB/NLB/EC2/EIP).',
                'Layer-4, no caching; near-instant cross-Region failover and traffic dials/weights.',
                'Best for TCP/UDP, gaming, VoIP, IoT, static-IP needs and multi-Region failover.',
                'CloudFront caches HTTP(S) content; Global Accelerator does not — they complement each other.',
              ],
              commonMistakes: [
                'Choosing Global Accelerator to cache web content — that is CloudFront\'s job.',
                'Choosing CloudFront when the requirement is fixed static IPs or non-HTTP failover — use Global Accelerator.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  U[Users worldwide] --> AIP[2 static anycast IPs]',
                  '  AIP --> BB[AWS backbone]',
                  '  BB --> R1[Endpoint us-east-1]',
                  '  BB --> R2[Endpoint eu-west-1]',
                ],
                caption: 'Global Accelerator presents static IPs and routes over the backbone to the nearest healthy Region.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A UDP-based game needs fixed entry-point IPs and instant failover between Regions. CloudFront or Global Accelerator?',
                  solution: { explanation: 'AWS Global Accelerator — Layer-4, static anycast IPs, fast cross-Region failover, and it supports UDP. CloudFront is for cacheable HTTP content.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A media site wants to cache images and video close to users to cut latency and origin load. Which service?',
                  solution: { explanation: 'Amazon CloudFront (a CDN that caches content at the edge).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html',
            },
          ],
        },
        {
          id: 'ans2-t3',
          name: 'Network performance',
          concepts: [
            {
              id: 'ans2-t3-c0',
              services: [{ icon: 'ec2', label: 'Amazon EC2 networking' }],
              title: 'Jumbo frames, ENA, EFA and placement groups',
              summary:
                'Squeeze maximum throughput and minimum latency with jumbo frames (9001 MTU), enhanced networking (ENA), Elastic Fabric Adapter (EFA) for HPC, and cluster placement groups.',
              explanation:
                'Within a VPC you can use jumbo frames with an MTU up to 9001 bytes, which raises throughput by carrying more payload per packet — but traffic leaving the VPC (over an internet gateway, most VPN, or some peering paths) is limited to 1500 bytes, and a wrong MTU causes fragmentation or black-holing, so set Path MTU correctly. Enhanced networking via the Elastic Network Adapter (ENA) gives higher packets-per-second, lower latency and lower jitter and supports up to 100 Gbps (and beyond on newer instances) using SR-IOV. The Elastic Fabric Adapter (EFA) is an ENA that adds an OS-bypass path for tightly coupled HPC and machine-learning workloads using MPI/NCCL, giving very low and consistent inter-node latency. Placement groups influence physical placement: cluster packs instances close together in one AZ for the lowest network latency and highest throughput (great with EFA); spread keeps instances on distinct hardware for resilience; partition isolates groups across racks for large distributed systems like Hadoop/Cassandra.',
              keyPoints: [
                'Jumbo frames (MTU 9001) boost in-VPC throughput; outside the VPC the limit is usually 1500.',
                'ENA = enhanced networking (SR-IOV): higher PPS, lower latency, up to 100 Gbps+.',
                'EFA adds OS-bypass for HPC/ML (MPI/NCCL) with very low inter-node latency.',
                'Cluster placement group = lowest latency/highest throughput in one AZ (pair with EFA).',
                'Spread = max resilience on distinct hardware; partition = isolated racks for big distributed apps.',
              ],
              commonMistakes: [
                'Setting MTU 9001 and seeing dropped/black-holed traffic when packets leave the VPC (where 1500 applies).',
                'Using a cluster placement group across AZs — it must be in a single AZ to deliver its latency benefit.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  CL[Cluster PG<br/>single AZ, low latency] --- EFA[EFA + ENA]',
                  '  SP[Spread PG<br/>distinct hardware]',
                  '  PA[Partition PG<br/>isolated racks]',
                ],
                caption: 'Placement-group strategies trade latency for resilience; cluster + EFA is the HPC low-latency choice.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A tightly coupled HPC simulation needs the lowest possible inter-node latency. Which adapter and placement group?',
                  solution: { explanation: 'An Elastic Fabric Adapter (EFA) with instances in a cluster placement group (single AZ).' },
                },
                {
                  type: 'quiz',
                  prompt: 'Why might enabling MTU 9001 break connectivity to the internet from an instance?',
                  solution: { explanation: 'Jumbo frames are valid within the VPC, but traffic to the internet (via the internet gateway) is capped at 1500 bytes; mismatched MTU causes fragmentation or black-holing unless Path MTU discovery works.' },
                },
                {
                  type: 'task',
                  prompt: 'You need to ensure a small fleet of critical instances never share underlying hardware. Which placement group?',
                  solution: { explanation: 'A spread placement group, which places each instance on distinct hardware.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/network_mtu.html',
            },
          ],
        },
      ],
    },

    /* ───────────── DOMAIN 3 — NETWORK MANAGEMENT AND OPERATION (20%) ───────────── */
    {
      level: 3,
      name: 'Management & Operation',
      focus: 'Monitoring, logging, troubleshooting, automation and operating networks at scale (Domain 3 · 20%)',
      accent: '#e8862a',
      soft: '#fff1e2',
      topics: [
        {
          id: 'ans3-t0',
          name: 'Monitoring & logging',
          concepts: [
            {
              id: 'ans3-t0-c0',
              services: [{ icon: 'vpc', label: 'VPC Flow Logs' }, { icon: 'cloudwatch', label: 'Amazon CloudWatch' }],
              title: 'VPC Flow Logs and CloudWatch for network visibility',
              summary:
                'VPC Flow Logs capture IP traffic metadata (the 5-tuple plus accept/reject) at the VPC, subnet or ENI level; CloudWatch metrics and Logs Insights turn that data into dashboards, alarms and troubleshooting.',
              explanation:
                'VPC Flow Logs record metadata about IP traffic — source/destination IP and port, protocol, packet and byte counts, the action (ACCEPT or REJECT) and the timestamp — but not the packet payload. You enable them at the VPC, subnet or network-interface scope and publish to CloudWatch Logs, Amazon S3, or Amazon Data Firehose; a custom format can add fields like the TCP flags, traffic path, and which rule (security group vs NACL) decided the outcome. Flow logs are the primary tool for answering "is traffic even reaching this instance, and is it being accepted or rejected." Pair them with CloudWatch: ELB, NAT gateway, Transit Gateway, VPN and other services publish CloudWatch metrics (e.g. ActiveFlowCount, ProcessedBytes, TunnelState), you set alarms on them, and CloudWatch Logs Insights queries flow logs to find top talkers or rejected flows. Because flow logs omit payload, they show whether and how much traffic flows, not its contents — capture packets with traffic mirroring when you need the actual bytes.',
              keyPoints: [
                'Flow Logs capture the 5-tuple + bytes/packets + ACCEPT/REJECT, not payload.',
                'Scope at VPC, subnet, or ENI; publish to CloudWatch Logs, S3, or Data Firehose.',
                'Custom format adds TCP flags, traffic path and which control (SG/NACL) decided ACCEPT/REJECT.',
                'CloudWatch metrics/alarms watch ELB, NAT, TGW and VPN health; Logs Insights queries flow logs.',
                'Use traffic mirroring when you need actual packet contents, not just metadata.',
              ],
              commonMistakes: [
                'Expecting Flow Logs to contain packet payloads — they only hold metadata; use traffic mirroring for payload.',
                'Looking for rejected traffic when flow logs are filtered to ACCEPT only — set the filter to ALL or REJECT.',
              ],
              code: {
                language: 'text',
                lines: [
                  '2 12345 eni-abc 10.0.1.10 10.0.2.20 49152 443 6 20 4000 1620000000 1620000060 ACCEPT OK',
                  'fields: version account eni srcaddr dstaddr srcport dstport protocol packets bytes start end action status',
                ],
                explanation: 'A default-format VPC Flow Log record: protocol 6 is TCP, the flow to port 443 was ACCEPTed.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Traffic to an instance seems to be dropped. Which tool shows whether packets are arriving and being ACCEPTed or REJECTed?',
                  solution: { explanation: 'VPC Flow Logs — they record the 5-tuple and the ACCEPT/REJECT action at the ENI/subnet/VPC level.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A team needs the actual packet contents for deep inspection, not just metadata. What do they use?',
                  solution: { explanation: 'VPC Traffic Mirroring (copies packets to a monitoring appliance); Flow Logs only contain metadata.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html',
            },
            {
              id: 'ans3-t0-c1',
              services: [{ icon: 'vpc', label: 'Network Manager' }],
              title: 'Network Manager and Transit Gateway Network Manager',
              summary:
                'Network Manager gives a central, visual view of your global network — Transit Gateways, VPCs, VPNs, Direct Connect and on-premises sites — with topology maps, route analysis and CloudWatch events.',
              explanation:
                'As networks grow across Regions and accounts, AWS Network Manager provides one place to model and monitor them. You define a global network and register Transit Gateways (and Cloud WAN core networks); Network Manager then draws a topology of attachments, VPCs, VPNs, Direct Connect gateways and your defined on-premises sites and links, shows their health and metrics, and raises events to CloudWatch when state changes (for example a VPN tunnel going down). Transit Gateway Network Manager specifically visualises TGW route tables and lets you run route analysis to confirm whether a packet from a given source can reach a destination given the current TGW routes and associations — invaluable for troubleshooting transitive routing. It integrates with CloudWatch and EventBridge for alerting and with Reachability Analyzer for path verification. Use it to operate, visualise and audit a multi-Region, multi-account backbone from a single dashboard.',
              keyPoints: [
                'Network Manager centralises a global view of TGWs, VPCs, VPNs, DX and on-prem sites.',
                'Draws topology maps and surfaces health, metrics and configuration changes.',
                'Transit Gateway route analysis verifies whether a source can reach a destination via the TGW.',
                'Emits events to CloudWatch/EventBridge (e.g. tunnel down) for proactive alerting.',
                'Works with Cloud WAN and complements Reachability Analyzer.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You manage Transit Gateways and VPNs across several Regions and want one dashboard with topology and health. Which service?',
                  solution: { explanation: 'AWS Network Manager (Transit Gateway / Cloud WAN Network Manager).' },
                },
                {
                  type: 'quiz',
                  prompt: 'You suspect TGW route-table associations are blocking a flow. What Network Manager feature confirms reachability through the TGW?',
                  solution: { explanation: 'Transit Gateway route analysis, which evaluates whether a source can reach a destination given current TGW routes/associations.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/network-manager/latest/tgwnm/what-are-global-networks.html',
            },
          ],
        },
        {
          id: 'ans3-t1',
          name: 'Troubleshooting',
          concepts: [
            {
              id: 'ans3-t1-c0',
              services: [{ icon: 'vpc', label: 'Reachability Analyzer' }],
              title: 'Reachability Analyzer and a structured troubleshooting method',
              summary:
                'Reachability Analyzer statically traces the path between two resources and tells you if traffic can flow and, if not, exactly which component blocks it — no packets sent.',
              explanation:
                'VPC Reachability Analyzer performs configuration analysis (not live probing) of the network path between a source and a destination — for example two ENIs, an internet gateway, or a Transit Gateway. It returns whether the path is reachable and, when it is not, the precise blocking component: a missing route, a security group that does not allow the port, a NACL deny, or a misconfigured gateway. Because it reasons about configuration, it works even when the workload is down. A reliable manual method follows the packet\'s journey in order: confirm DNS resolves; check the subnet route table has a route to the destination; check the security group (stateful, evaluated together, allow-only) permits the traffic both ways implicitly; check the network ACL (stateless, ordered, must allow return traffic explicitly, including ephemeral ports); verify the gateway/endpoint (IGW/NAT/TGW/endpoint) is present and routed; and only then look at the application. Reachability Analyzer short-circuits much of this by naming the blocker directly.',
              keyPoints: [
                'Reachability Analyzer statically checks if a path exists and names the blocking component.',
                'It analyses configuration, so it works even when the destination is offline — no packets sent.',
                'Manual order: DNS, route table, security group (stateful), NACL (stateless + ephemeral), gateway, app.',
                'Security groups are stateful (return traffic auto-allowed); NACLs are stateless (must allow return + ephemeral).',
                'A missing route, a wrong SG/NACL rule, or an absent gateway are the usual culprits.',
              ],
              commonMistakes: [
                'Forgetting NACLs need explicit return rules including the ephemeral port range (e.g. 1024-65535).',
                'Blaming the application when a route-table or security-group misconfiguration is the real blocker.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  DNS[DNS resolves?] --> RT[Route table has route?]',
                  '  RT --> SG[Security group allows?]',
                  '  SG --> NACL[NACL allows in + return?]',
                  '  NACL --> GW[Gateway/endpoint present?]',
                  '  GW --> APP[Application listening?]',
                ],
                caption: 'A structured top-to-bottom connectivity check; Reachability Analyzer can identify the blocker directly.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'An instance cannot reach a destination and you want to know the exact blocking component without sending traffic. Which tool?',
                  solution: { explanation: 'VPC Reachability Analyzer — it analyses the configured path and reports the specific blocker (route, SG, NACL or gateway).' },
                },
                {
                  type: 'predict',
                  prompt: 'A security group allows inbound 443 but a NACL allows inbound 443 only (no outbound). Will an HTTPS reply succeed?',
                  solution: { explanation: 'No — NACLs are stateless, so the outbound return traffic on the ephemeral port range must be explicitly allowed. The connection establishes inbound but the response is blocked outbound.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/reachability/what-is-reachability-analyzer.html',
            },
          ],
        },
        {
          id: 'ans3-t2',
          name: 'Automation & resilience',
          concepts: [
            {
              id: 'ans3-t2-c0',
              services: [{ icon: 'cloudformation', label: 'AWS CloudFormation' }],
              title: 'Automating network infrastructure with CloudFormation',
              summary:
                'CloudFormation provisions VPCs, subnets, route tables, gateways, Transit Gateways and endpoints as code from templates, giving repeatable, version-controlled, multi-account network deployments.',
              explanation:
                'Networking benefits hugely from infrastructure as code because IP plans, route tables and peering must be consistent and auditable. AWS CloudFormation describes resources in a YAML/JSON template; a stack creates and manages them as a unit, handles dependency ordering (an internet gateway is attached before routes reference it), supports parameters for reuse across environments, and updates safely with change sets. For multi-account, multi-Region rollouts (a landing zone\'s shared networking) StackSets deploy the same template across an Organization. Nested stacks and modules keep large network templates manageable, and outputs/exports let one stack reference another (for example a VPC stack exporting subnet IDs to an application stack). This is the exam\'s answer for repeatable, drift-detectable network provisioning; the AWS CDK and Terraform are alternatives that generate or manage similar infrastructure.',
              keyPoints: [
                'CloudFormation provisions VPCs, subnets, routes, gateways, TGWs and endpoints declaratively.',
                'Stacks manage resources as a unit with automatic dependency ordering and safe change sets.',
                'StackSets roll the same template across many accounts/Regions (landing zones).',
                'Outputs/exports let stacks reference each other (e.g. share subnet IDs); drift detection finds manual changes.',
                'Nested stacks/modules keep large network templates maintainable.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'Resources:',
                  '  Vpc:',
                  '    Type: AWS::EC2::VPC',
                  '    Properties:',
                  '      CidrBlock: 10.20.0.0/16',
                  '      EnableDnsHostnames: true',
                  '  PrivateSubnet:',
                  '    Type: AWS::EC2::Subnet',
                  '    Properties:',
                  '      VpcId: !Ref Vpc',
                  '      CidrBlock: 10.20.1.0/24',
                  '      AvailabilityZone: !Select [0, !GetAZs ]',
                ],
                explanation: 'A minimal CloudFormation snippet creating a VPC and a private subnet; !Ref and !GetAZs wire resources and AZs together.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You must deploy an identical baseline VPC design into 30 accounts across 3 Regions consistently. Which CloudFormation feature?',
                  solution: { explanation: 'CloudFormation StackSets — deploy and manage one template across many accounts and Regions.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Someone manually changed a route table that CloudFormation manages. How do you detect this?',
                  solution: { explanation: 'Run drift detection on the stack, which reports resources whose live configuration differs from the template.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html',
            },
            {
              id: 'ans3-t2-c1',
              services: [{ icon: 'route53', label: 'Route 53 ARC' }],
              title: 'Route 53 Application Recovery Controller for failover',
              summary:
                'Route 53 Application Recovery Controller adds readiness checks and highly reliable routing controls (manual on/off switches) so you can fail an application over between cells/Regions with confidence.',
              explanation:
                'Health-check-based DNS failover is reactive and can be slow or ambiguous during partial failures. Route 53 Application Recovery Controller (ARC) gives two capabilities. Readiness checks continuously audit whether your standby (recovery) environment is actually scaled and configured to take over — capacity, quotas, routing and configuration — so you are not surprised at failover time. Routing controls are simple, highly available on/off switches (backed by a cluster of five Regional endpoints with extreme reliability) that you flip to shift traffic, gated by safety rules (assertions) that prevent unsafe states such as turning off all cells at once. ARC suits the most demanding multi-Region/multi-AZ applications that need deterministic, operator-driven recovery rather than relying solely on automatic health checks. It complements standard Route 53 health checks and failover routing.',
              keyPoints: [
                'ARC readiness checks verify the recovery environment can really take the load before you fail over.',
                'Routing controls are highly available manual on/off switches to shift traffic between cells/Regions.',
                'Safety rules (assertions) prevent unsafe actions like disabling every cell simultaneously.',
                'Backed by a five-Region cluster for extreme reliability of the control plane.',
                'For mission-critical multi-Region apps needing deterministic, operator-driven failover.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A bank needs operator-controlled, highly reliable failover between two Regions, with assurance the standby is ready. Which service?',
                  solution: { explanation: 'Route 53 Application Recovery Controller — readiness checks plus routing controls with safety rules.' },
                },
                {
                  type: 'quiz',
                  prompt: 'What ARC feature stops an operator from accidentally turning off all cells at the same time?',
                  solution: { explanation: 'Safety rules (assertions) on the routing controls.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/r53recovery/latest/dg/what-is-route53-recovery.html',
            },
          ],
        },
      ],
    },

    /* ──────── DOMAIN 4 — NETWORK SECURITY, COMPLIANCE, AND GOVERNANCE (24%) ──────── */
    {
      level: 4,
      name: 'Security & Governance',
      focus: 'Securing the network: layered controls, firewalls, DDoS/WAF, encryption in transit, threat detection and governance (Domain 4 · 24%)',
      accent: '#1ba85a',
      soft: '#e6f7ee',
      topics: [
        {
          id: 'ans4-t0',
          name: 'Layered VPC controls',
          concepts: [
            {
              id: 'ans4-t0-c0',
              services: [{ icon: 'vpc', label: 'Security Groups & NACLs' }],
              title: 'Security groups vs network ACLs',
              summary:
                'Security groups are stateful, instance-level allow-only firewalls; network ACLs are stateless, subnet-level, ordered rule lists that allow and deny. Used together they form defence in depth.',
              explanation:
                'Security groups attach to elastic network interfaces (instances, endpoints, load balancers) and are stateful: if you allow inbound traffic, the response is automatically allowed out (and vice versa), and you can only write allow rules — anything not allowed is implicitly denied. Rules can reference IP ranges or other security groups (handy for tiered apps: "allow the web SG to reach the app SG on 8080"). Network ACLs sit at the subnet boundary and are stateless: every rule is numbered and evaluated in order until a match, they support both allow and deny, and because they do not track state you must explicitly allow the return traffic — typically the ephemeral port range (1024-65535) outbound for inbound connections and vice versa. The default NACL allows all traffic; a custom NACL denies all until you add rules. Best practice uses security groups as the primary control with NACLs as a coarse subnet-level guard (for example to block a malicious IP range across an entire subnet).',
              keyPoints: [
                'Security groups: stateful, instance/ENI level, allow-only, can reference other SGs.',
                'Network ACLs: stateless, subnet level, numbered allow AND deny rules evaluated in order.',
                'Stateless NACLs require explicit return rules — remember the ephemeral port range (1024-65535).',
                'Default NACL allows all; custom NACL denies all until rules are added.',
                'Use SGs as the main control; NACLs as a coarse subnet-wide guard (defence in depth).',
              ],
              commonMistakes: [
                'Adding a deny rule to a security group — SGs only support allow rules.',
                'Forgetting the ephemeral-port return rule on a NACL and breaking responses.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Net[Traffic] --> NACL[Network ACL<br/>stateless, subnet]',
                  '  NACL --> SG[Security group<br/>stateful, ENI]',
                  '  SG --> EC2[Instance]',
                ],
                caption: 'Traffic passes the subnet NACL, then the instance security group — two layers of control.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why might inbound traffic be allowed by a NACL yet the reply still fail?',
                  solution: { explanation: 'NACLs are stateless, so the return traffic (typically on ephemeral ports 1024-65535) must be explicitly allowed outbound; otherwise the response is blocked.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which control can you use to explicitly block a single malicious IP range across an entire subnet?',
                  solution: { explanation: 'A network ACL — it supports explicit deny rules at the subnet level. Security groups cannot deny.' },
                },
                {
                  type: 'task',
                  prompt: 'How do you let web-tier instances reach app-tier instances on port 8080 without hard-coding IPs?',
                  solution: { explanation: 'In the app-tier security group, allow inbound 8080 from the web-tier security group (security groups can reference other security groups).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-best-practices.html',
            },
          ],
        },
        {
          id: 'ans4-t1',
          name: 'Network firewalls & DNS security',
          concepts: [
            {
              id: 'ans4-t1-c0',
              services: [{ icon: 'security', label: 'AWS Network Firewall' }],
              title: 'AWS Network Firewall and centralised inspection',
              summary:
                'AWS Network Firewall is a managed, stateful, scalable network firewall and IPS for VPC traffic, deployed via dedicated firewall subnets and commonly centralised behind a Transit Gateway inspection VPC.',
              explanation:
                'AWS Network Firewall provides managed, stateful traffic filtering and intrusion prevention at the VPC level — far deeper than security groups or NACLs. It supports stateless and stateful rule groups, Suricata-compatible rules, domain-name allow/deny lists, and protocol/port filtering, scaling automatically with traffic. You deploy firewall endpoints into dedicated firewall subnets and steer traffic to them with route tables. The common enterprise pattern is a centralised inspection VPC attached to a Transit Gateway: all inter-VPC, ingress and egress traffic is routed through the inspection VPC where Network Firewall (or a third-party appliance behind a Gateway Load Balancer) inspects it, so you enforce one policy for the whole network instead of per-VPC. Network Firewall complements WAF (Layer 7 HTTP) and Shield (DDoS) — it inspects Layer 3/4 (and some Layer 7 via Suricata) flows. Use it for egress filtering to approved domains, east-west inspection between VPCs, and IPS.',
              keyPoints: [
                'Managed, stateful firewall + IPS for VPCs; Suricata-compatible and domain filtering.',
                'Deployed via firewall endpoints in dedicated firewall subnets, steered by route tables.',
                'Centralised inspection VPC behind a Transit Gateway enforces one policy network-wide.',
                'Great for egress filtering to allowed domains and east-west (inter-VPC) inspection.',
                'Complements WAF (L7 HTTP) and Shield (DDoS); GWLB inserts third-party appliances similarly.',
              ],
              commonMistakes: [
                'Putting workloads in the firewall subnet — firewall endpoints need their own dedicated subnets with careful routing.',
                'Expecting Network Firewall to replace WAF for HTTP-layer attacks; WAF handles Layer-7 web exploits.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  V1[Spoke VPC] --> TGW{Transit Gateway}',
                  '  TGW --> INS[Inspection VPC<br/>Network Firewall]',
                  '  INS --> TGW',
                  '  TGW --> EG[Egress / other VPCs]',
                ],
                caption: 'A centralised inspection VPC routes all traffic through AWS Network Firewall for a single policy.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A company wants to inspect and filter all egress traffic to only approved domains across dozens of VPCs from one place. Which design?',
                  solution: { explanation: 'A centralised inspection VPC with AWS Network Firewall, attached to a Transit Gateway, with routes steering all egress through it (domain allow-lists enforced by stateful rules).' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which rule language does AWS Network Firewall support for stateful inspection?',
                  solution: { explanation: 'Suricata-compatible rules (plus managed domain/IP rule groups).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html',
            },
            {
              id: 'ans4-t1-c1',
              services: [{ icon: 'route53', label: 'Route 53 Resolver DNS Firewall' }],
              title: 'Route 53 Resolver DNS Firewall',
              summary:
                'DNS Firewall filters outbound DNS queries from your VPCs, blocking or allowing domains to stop data exfiltration and command-and-control via DNS, using managed or custom domain lists.',
              explanation:
                'Attackers often abuse DNS to exfiltrate data or reach command-and-control servers because DNS is frequently allowed out unfiltered. Route 53 Resolver DNS Firewall inspects DNS queries leaving your VPCs (resolved by the Route 53 Resolver) and applies rule groups of domain lists with actions ALLOW, BLOCK (with NODATA/NXDOMAIN or a custom override response), or ALERT. AWS provides managed domain lists (for example known malware and botnet domains) that you can subscribe to, and you can define your own allow/deny lists. Rules are evaluated by priority, and you can default to allow-with-logging or to a strict allow-list posture. This sits at the DNS layer and is complementary to Network Firewall (which filters IP traffic) and to GuardDuty (which can detect DNS-based threats from logs). Use DNS Firewall to enforce that workloads can only resolve approved domains and to block known-bad domains automatically.',
              keyPoints: [
                'Filters outbound DNS queries from VPCs to stop exfiltration and C2 over DNS.',
                'Actions: ALLOW, BLOCK (NODATA/NXDOMAIN/override), or ALERT; rules ordered by priority.',
                'Managed domain lists (e.g. malware/botnet) plus custom allow/deny lists.',
                'Operates at the DNS layer — complements Network Firewall (IP) and GuardDuty (detection).',
                'Enforce strict allow-listing of resolvable domains for sensitive workloads.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You want to stop instances from resolving known malware domains and prevent DNS-based data exfiltration. Which service?',
                  solution: { explanation: 'Route 53 Resolver DNS Firewall, using managed bad-domain lists and/or strict allow-listing.' },
                },
                {
                  type: 'predict',
                  prompt: 'DNS Firewall blocks a domain but the workload still reaches the IP directly. Why, and what closes the gap?',
                  solution: { explanation: 'DNS Firewall only filters DNS queries, not IP traffic. If the IP is hard-coded the DNS layer is bypassed; add AWS Network Firewall (or NACL/SG rules) to filter the actual IP traffic.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-dns-firewall.html',
            },
          ],
        },
        {
          id: 'ans4-t2',
          name: 'Edge protection: WAF & Shield',
          concepts: [
            {
              id: 'ans4-t2-c0',
              services: [{ icon: 'waf', label: 'AWS WAF' }, { icon: 'shield', label: 'AWS Shield' }],
              title: 'AWS WAF and Shield at the edge',
              summary:
                'AWS WAF filters Layer-7 web requests on CloudFront, ALB, API Gateway and AppSync; AWS Shield protects against DDoS — Standard automatically and free, Advanced for enhanced protection and response.',
              explanation:
                'AWS WAF (Web Application Firewall) inspects HTTP(S) requests and lets you allow, block, count or challenge them with rules in a Web ACL. Rules match on IPs, geo, headers, body, URI, query strings, or rates, and AWS Managed Rules cover common threats such as SQL injection, cross-site scripting and the OWASP top risks; rate-based rules throttle abusive sources. You associate a Web ACL with CloudFront (global edge), an Application Load Balancer, Amazon API Gateway, AppSync, or Cognito. AWS Shield defends against distributed denial-of-service attacks: Shield Standard is automatic and free for all customers, protecting against common Layer-3/4 attacks; Shield Advanced is a paid subscription adding protection for higher-layer and larger attacks, near-real-time visibility, cost-protection for scaling during an attack, WAF at no extra cost, and access to the Shield Response Team (SRT). Combine WAF (application-layer filtering) with Shield (volumetric DDoS) and put both in front of edge entry points for layered protection.',
              keyPoints: [
                'WAF filters Layer-7 requests via Web ACLs on CloudFront, ALB, API Gateway, AppSync, Cognito.',
                'AWS Managed Rules cover SQLi, XSS, OWASP risks; rate-based rules throttle abusive clients.',
                'Shield Standard: automatic, free, common L3/L4 DDoS protection for everyone.',
                'Shield Advanced: paid — larger/higher-layer DDoS, cost protection, included WAF, and the SRT.',
                'Layer WAF (app) + Shield (volumetric) at edge entry points for defence in depth.',
              ],
              commonMistakes: [
                'Expecting WAF to stop volumetric network DDoS — that is Shield\'s role; WAF handles Layer-7 request filtering.',
                'Attaching a WAF Web ACL meant for CloudFront to a Regional resource (or vice versa) — scope must match.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[Users] --> SH[Shield: DDoS]',
                  '  SH --> WAF[WAF Web ACL: L7 rules]',
                  '  WAF --> CF[CloudFront / ALB / API GW]',
                  '  CF --> Origin[Origin / app]',
                ],
                caption: 'Shield absorbs volumetric DDoS while WAF filters malicious Layer-7 requests before they reach the origin.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Your public API is being hit with SQL-injection and a flood of requests from a few IPs. Which service and rule types address this?',
                  solution: { explanation: 'AWS WAF — AWS Managed Rules for SQL injection plus a rate-based rule to throttle the abusive IPs, attached to the API Gateway/ALB/CloudFront.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which level of AWS Shield gives access to the Shield Response Team and DDoS cost protection?',
                  solution: { explanation: 'AWS Shield Advanced (paid). Shield Standard is automatic and free but without these features.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html',
            },
          ],
        },
        {
          id: 'ans4-t3',
          name: 'Encryption in transit & threat detection',
          concepts: [
            {
              id: 'ans4-t3-c0',
              services: [{ icon: 'security', label: 'TLS / ACM' }, { icon: 'kms', label: 'AWS KMS' }],
              title: 'Encryption in transit: TLS, ACM and where to terminate',
              summary:
                'Protect data on the wire with TLS, manage certificates with ACM, and decide where to terminate or re-encrypt — at CloudFront, the load balancer, or the instance — based on inspection and compliance needs.',
              explanation:
                'Encryption in transit prevents eavesdropping and tampering. TLS secures HTTP(S) and other protocols; AWS Certificate Manager (ACM) provisions, manages and auto-renews public and private certificates and integrates with CloudFront, ALB, API Gateway and NLB (ACM certs for CloudFront must be in us-east-1). Where you terminate TLS is a design decision: terminating at the load balancer offloads crypto and lets an ALB inspect Layer-7 traffic and apply WAF, but the hop from the LB to the target is plaintext unless you re-encrypt (end-to-end TLS) — required when compliance demands encryption all the way to the instance. An NLB can pass TLS through to the target (TLS passthrough) when the backend must terminate. Beyond HTTPS, hybrid links should be encrypted: Site-to-Site VPN is IPsec-encrypted by default, Direct Connect is not (add VPN-over-DX or MACsec), and inter-Region Transit Gateway peering and VPC traffic on the AWS backbone is encrypted by AWS. Match the termination point to your need for inspection versus end-to-end confidentiality.',
              keyPoints: [
                'TLS protects data in transit; ACM provisions and auto-renews certs (CloudFront certs in us-east-1).',
                'Terminate at the LB to offload crypto + inspect/apply WAF; re-encrypt to the target for end-to-end TLS.',
                'NLB TLS passthrough lets the backend terminate when required.',
                'VPN is encrypted by default; Direct Connect is not (use VPN-over-DX or MACsec).',
                'AWS encrypts inter-Region TGW peering and backbone traffic between AZs/Regions.',
              ],
              commonMistakes: [
                'Terminating TLS at the ALB and assuming the LB-to-instance hop is also encrypted — it is plaintext unless you re-encrypt.',
                'Believing Direct Connect encrypts traffic by default — it does not; add VPN or MACsec.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Client -->|TLS| ALB[ALB terminates TLS]',
                  '  ALB -->|re-encrypt TLS| EC2[Instance]',
                  '  ALB -.plaintext if not re-encrypted.-> EC2',
                ],
                caption: 'For end-to-end encryption, re-encrypt from the load balancer to the target rather than sending plaintext on the back hop.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Compliance requires traffic to be encrypted all the way to the EC2 instance, but you also want WAF inspection at the ALB. How?',
                  solution: { explanation: 'Terminate TLS at the ALB (so WAF can inspect Layer-7), then re-encrypt the connection from the ALB to the instance (end-to-end TLS / backend HTTPS).' },
                },
                {
                  type: 'quiz',
                  prompt: 'Is traffic over an unmodified Direct Connect link encrypted?',
                  solution: { explanation: 'No — Direct Connect is private but not encrypted by default. Add a VPN over the DX (VPN-over-DX) or enable MACsec for encryption.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html',
            },
            {
              id: 'ans4-t3-c1',
              services: [{ icon: 'guardduty', label: 'Amazon GuardDuty' }],
              title: 'Threat detection and network governance',
              summary:
                'GuardDuty continuously analyses VPC Flow Logs, DNS logs and CloudTrail to detect malicious network activity; pair it with org-wide guardrails (SCPs, Firewall Manager) for governance at scale.',
              explanation:
                'Amazon GuardDuty is a managed threat-detection service that analyses data sources — VPC Flow Logs, Route 53 DNS query logs and CloudTrail events — using threat intelligence and machine learning to surface findings such as communication with known-malicious IPs, port-scanning, cryptocurrency-mining traffic, DNS exfiltration patterns and unusual API behaviour. It needs no agents and works across an Organization with a delegated administrator. For governance across many accounts, AWS Firewall Manager centrally configures and audits WAF rules, Shield Advanced protections, security groups, Network Firewall and DNS Firewall policies organisation-wide, ensuring new accounts and resources inherit the required controls. Service Control Policies (SCPs) in AWS Organizations act as permission guardrails — for example preventing member accounts from disabling flow logs, deleting the inspection route, or creating internet gateways. Together these give continuous detection (GuardDuty), consistent enforcement (Firewall Manager) and hard guardrails (SCPs) — the governance triad the exam expects for a secure multi-account network.',
              keyPoints: [
                'GuardDuty analyses VPC Flow Logs, DNS logs and CloudTrail for network threats — agentless.',
                'Detects malicious-IP comms, port scans, crypto-mining, DNS exfiltration and anomalous API use.',
                'AWS Firewall Manager centrally enforces WAF/Shield/Network Firewall/DNS Firewall/SG policies org-wide.',
                'SCPs in AWS Organizations enforce hard guardrails (e.g. no disabling flow logs, no new IGWs).',
                'Detection (GuardDuty) + enforcement (Firewall Manager) + guardrails (SCPs) = scalable governance.',
              ],
              commonMistakes: [
                'Thinking GuardDuty blocks attacks — it detects and reports; remediation comes via automation (EventBridge/Lambda) or firewall changes.',
                'Configuring WAF/firewall rules per account by hand instead of centrally with Firewall Manager.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  FL[VPC Flow Logs] --> GD{GuardDuty}',
                  '  DNS[DNS query logs] --> GD',
                  '  CT[CloudTrail] --> GD',
                  '  GD --> F[Findings] --> EB[EventBridge to automate response]',
                ],
                caption: 'GuardDuty correlates network and API data sources into findings you can act on automatically.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which service analyses VPC Flow Logs, DNS logs and CloudTrail to detect malicious network activity without deploying agents?',
                  solution: { explanation: 'Amazon GuardDuty.' },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you ensure every account in an Organization always has the same WAF and Network Firewall policies, including new accounts?',
                  solution: { explanation: 'Use AWS Firewall Manager to centrally define and enforce the policies organisation-wide.' },
                },
                {
                  type: 'task',
                  prompt: 'What org-wide control prevents member accounts from disabling VPC Flow Logs or creating internet gateways?',
                  solution: { explanation: 'Service Control Policies (SCPs) in AWS Organizations — permission guardrails that deny those actions regardless of account-level IAM.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
