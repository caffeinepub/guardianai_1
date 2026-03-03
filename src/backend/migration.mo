import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    children : Map.Map<Nat, { id : Nat; name : Text; age : Nat; deviceName : Text; avatarUrl : Text; createdAt : Time.Time; parentId : Principal }>;
    locations : Map.Map<Nat, { id : Nat; childId : Nat; latitude : Float; longitude : Float; address : Text; timestamp : Time.Time }>;
    safeZones : Map.Map<Nat, { id : Nat; childId : Nat; name : Text; address : Text; latitude : Float; longitude : Float; radius : Nat; isActive : Bool }>;
    screenTime : Map.Map<Nat, { id : Nat; childId : Nat; appName : Text; category : { #social; #gaming; #educational; #entertainment; #other }; durationMinutes : Nat; date : Text }>;
    contentRecords : Map.Map<Nat, { id : Nat; childId : Nat; url : Text; title : Text; category : { #social; #gaming; #educational; #entertainment; #other }; riskScore : Nat; flagged : Bool; timestamp : Time.Time }>;
    bullyingAlerts : Map.Map<Nat, { id : Nat; childId : Nat; platform : Text; severity : { #low; #medium; #high }; snippet : Text; timestamp : Time.Time; status : { #new; #reviewed; #dismissed } }>;
    spendingRecords : Map.Map<Nat, { id : Nat; childId : Nat; amount : Nat; category : Text; merchant : Text; timestamp : Time.Time }>;
    recommendations : Map.Map<Nat, { id : Nat; childId : Nat; tipType : { #screen_time; #content; #social; #financial; #wellbeing }; content : Text; priority : Nat; createdAt : Time.Time; isRead : Bool }>;
    parentSettings : Map.Map<Principal, { parentId : Principal; notificationsEnabled : Bool; weeklyReportEnabled : Bool; alertThreshold : { #low; #medium; #high } }>;
    nextProfileId : Nat;
  };

  type NewActor = {
    children : Map.Map<Nat, { id : Nat; name : Text; age : Nat; deviceName : Text; avatarUrl : Text; createdAt : Time.Time; parentId : Principal }>;
    locations : Map.Map<Nat, { id : Nat; childId : Nat; latitude : Float; longitude : Float; address : Text; timestamp : Time.Time }>;
    safeZones : Map.Map<Nat, { id : Nat; childId : Nat; name : Text; address : Text; latitude : Float; longitude : Float; radius : Nat; isActive : Bool }>;
    screenTime : Map.Map<Nat, { id : Nat; childId : Nat; appName : Text; category : { #social; #gaming; #educational; #entertainment; #other }; durationMinutes : Nat; date : Text }>;
    contentRecords : Map.Map<Nat, { id : Nat; childId : Nat; url : Text; title : Text; category : { #social; #gaming; #educational; #entertainment; #other }; riskScore : Nat; flagged : Bool; timestamp : Time.Time }>;
    bullyingAlerts : Map.Map<Nat, { id : Nat; childId : Nat; platform : Text; severity : { #low; #medium; #high }; snippet : Text; timestamp : Time.Time; status : { #new; #reviewed; #dismissed } }>;
    spendingRecords : Map.Map<Nat, { id : Nat; childId : Nat; amount : Nat; category : Text; merchant : Text; timestamp : Time.Time }>;
    recommendations : Map.Map<Nat, { id : Nat; childId : Nat; tipType : { #screen_time; #content; #social; #financial; #wellbeing }; content : Text; priority : Nat; createdAt : Time.Time; isRead : Bool }>;
    parentSettings : Map.Map<Principal, { parentId : Principal; notificationsEnabled : Bool; weeklyReportEnabled : Bool; alertThreshold : { #low; #medium; #high } }>;
    nextProfileId : Nat;
    parentAccounts : Map.Map<Principal, { email : Text; passwordHash : Text; plan : { #free; #family; #guardian_pro }; createdAt : Time.Time }>;
  };

  public func run(old : OldActor) : NewActor {
    let parentAccounts = Map.empty<Principal, { email : Text; passwordHash : Text; plan : { #free; #family; #guardian_pro }; createdAt : Time.Time }>();
    { old with parentAccounts };
  };
};
