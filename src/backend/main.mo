import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Bool "mo:core/Bool";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type ProfileId = Nat;
  type ChildProfile = {
    id : ProfileId;
    name : Text;
    age : Nat;
    deviceName : Text;
    avatarUrl : Text;
    createdAt : Time.Time;
    parentId : Principal; // Added for ownership
  };

  type LocationRecord = {
    id : ProfileId;
    childId : ProfileId;
    latitude : Float;
    longitude : Float;
    address : Text;
    timestamp : Time.Time;
  };

  type SafeZone = {
    id : ProfileId;
    childId : ProfileId;
    name : Text;
    address : Text;
    latitude : Float;
    longitude : Float;
    radius : Nat;
    isActive : Bool;
  };

  type Category = {
    #social;
    #gaming;
    #educational;
    #entertainment;
    #other;
  };

  module Category {
    public func compare(cat1 : Category, cat2 : Category) : Order.Order {
      switch (cat1, cat2) {
        case (#social, #social) { #equal };
        case (#social, _) { #less };
        case (#gaming, #social) { #greater };
        case (#gaming, #gaming) { #equal };
        case (#gaming, _) { #less };
        case (#educational, #entertainment) { #less };
        case (#educational, #other) { #less };
        case (#educational, _) { #greater };
        case (#entertainment, #other) { #less };
        case (#entertainment, _) { #greater };
        case (#other, #other) { #equal };
        case (#other, _) { #greater };
      };
    };
  };

  type ScreenTimeRecord = {
    id : ProfileId;
    childId : ProfileId;
    appName : Text;
    category : Category;
    durationMinutes : Nat;
    date : Text; // YYYY-MM-DD
  };

  type ContentRecord = {
    id : ProfileId;
    childId : ProfileId;
    url : Text;
    title : Text;
    category : Category;
    riskScore : Nat;
    flagged : Bool;
    timestamp : Time.Time;
  };

  type BullyingAlert = {
    id : ProfileId;
    childId : ProfileId;
    platform : Text;
    severity : { #low; #medium; #high };
    snippet : Text;
    timestamp : Time.Time;
    status : { #new; #reviewed; #dismissed };
  };

  type SpendingRecord = {
    id : ProfileId;
    childId : ProfileId;
    amount : Nat; // in cents
    category : Text;
    merchant : Text;
    timestamp : Time.Time;
  };

  type Recommendation = {
    #screen_time;
    #content;
    #social;
    #financial;
    #wellbeing;
  };

  module Recommendation {
    public func compare(type1 : Recommendation, type2 : Recommendation) : Order.Order {
      switch (type1, type2) {
        case (#screen_time, #screen_time) { #equal };
        case (#screen_time, _) { #less };
        case (#content, #screen_time) { #greater };
        case (#content, #content) { #equal };
        case (#content, _) { #less };
        case (#social, #financial) { #less };
        case (#social, #wellbeing) { #less };
        case (#social, _) { #greater };
        case (#financial, #wellbeing) { #less };
        case (#financial, _) { #greater };
        case (#wellbeing, #wellbeing) { #equal };
        case (#wellbeing, _) { #greater };
      };
    };
  };

  type AIRecommendation = {
    id : ProfileId;
    childId : ProfileId;
    tipType : Recommendation;
    content : Text;
    priority : Nat;
    createdAt : Time.Time;
    isRead : Bool;
  };

  type ParentSettings = {
    parentId : Principal;
    notificationsEnabled : Bool;
    weeklyReportEnabled : Bool;
    alertThreshold : { #low; #medium; #high };
  };

  type DashboardSummary = {
    todayScreenTime : Nat;
    unreadAlertsCount : Nat;
    todaySpendingTotal : Nat;
    latestLocation : ?LocationRecord;
    unreadRecommendationsCount : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  // Internal state
  var nextProfileId : ProfileId = 1;

  func generateProfileId() : ProfileId {
    let id = nextProfileId;
    nextProfileId += 1;
    id;
  };

  let children = Map.empty<ProfileId, ChildProfile>();
  let locations = Map.empty<ProfileId, LocationRecord>();
  let safeZones = Map.empty<ProfileId, SafeZone>();
  let screenTime = Map.empty<ProfileId, ScreenTimeRecord>();
  let contentRecords = Map.empty<ProfileId, ContentRecord>();
  let bullyingAlerts = Map.empty<ProfileId, BullyingAlert>();
  let spendingRecords = Map.empty<ProfileId, SpendingRecord>();
  let recommendations = Map.empty<ProfileId, AIRecommendation>();
  let parentSettings = Map.empty<Principal, ParentSettings>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper functions for authorization
  private func isChildOwner(caller : Principal, childId : ProfileId) : Bool {
    switch (children.get(childId)) {
      case (null) { false };
      case (?child) { Principal.equal(child.parentId, caller) };
    };
  };

  private func requireChildOwnership(caller : Principal, childId : ProfileId) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not isChildOwner(caller, childId)) {
        Runtime.trap("Unauthorized: You can only access your own children's data");
      };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not AccessControl.isAdmin(accessControlState, caller) and not Principal.equal(caller, user)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // CRUD for ChildProfile
  public shared ({ caller }) func addChild(name : Text, age : Nat, deviceName : Text, avatarUrl : Text) : async ProfileId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add children");
    };
    let id = generateProfileId();
    let profile : ChildProfile = {
      id;
      name;
      age;
      deviceName;
      avatarUrl;
      createdAt = Time.now();
      parentId = caller;
    };
    children.add(id, profile);
    id;
  };

  public shared ({ caller }) func updateChild(id : ProfileId, name : Text, age : Nat, deviceName : Text, avatarUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update children");
    };
    requireChildOwnership(caller, id);
    switch (children.get(id)) {
      case (null) { Runtime.trap("Child profile not found") };
      case (?existing) {
        let updated : ChildProfile = {
          id;
          name;
          age;
          deviceName;
          avatarUrl;
          createdAt = existing.createdAt;
          parentId = existing.parentId;
        };
        children.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteChild(id : ProfileId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete children");
    };
    requireChildOwnership(caller, id);
    if (not children.containsKey(id)) { Runtime.trap("Child profile not found") };
    children.remove(id);
  };

  public query ({ caller }) func getChildren() : async [ChildProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view children");
    };
    if (AccessControl.isAdmin(accessControlState, caller)) {
      children.values().toArray();
    } else {
      children.values().toArray().filter(func(child) { Principal.equal(child.parentId, caller) });
    };
  };

  public query ({ caller }) func getChild(id : ProfileId) : async ChildProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view children");
    };
    requireChildOwnership(caller, id);
    switch (children.get(id)) {
      case (null) { Runtime.trap("Child profile not found") };
      case (?profile) { profile };
    };
  };

  // Location Records
  public shared ({ caller }) func addLocation(childId : ProfileId, latitude : Float, longitude : Float, address : Text) : async ProfileId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add locations");
    };
    requireChildOwnership(caller, childId);
    if (not children.containsKey(childId)) { Runtime.trap("Child profile not found") };
    let id = generateProfileId();
    let location : LocationRecord = {
      id;
      childId;
      latitude;
      longitude;
      address;
      timestamp = Time.now();
    };
    locations.add(id, location);
    id;
  };

  public query ({ caller }) func getLocationHistory(childId : ProfileId) : async [LocationRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view locations");
    };
    requireChildOwnership(caller, childId);
    locations.values().toArray().filter(func(loc) { loc.childId == childId });
  };

  public query ({ caller }) func getLatestLocation(childId : ProfileId) : async ?LocationRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view locations");
    };
    requireChildOwnership(caller, childId);
    var latest : ?LocationRecord = null;
    for (location in locations.values()) {
      if (location.childId == childId) {
        switch (latest) {
          case (null) { latest := ?location };
          case (?existing) {
            if (location.timestamp > existing.timestamp) {
              latest := ?location;
            };
          };
        };
      };
    };
    latest;
  };

  // SafeZones
  public shared ({ caller }) func addSafeZone(childId : ProfileId, name : Text, address : Text, latitude : Float, longitude : Float, radius : Nat, isActive : Bool) : async ProfileId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add safe zones");
    };
    requireChildOwnership(caller, childId);
    let id = generateProfileId();
    let zone : SafeZone = {
      id;
      childId;
      name;
      address;
      latitude;
      longitude;
      radius;
      isActive;
    };
    safeZones.add(id, zone);
    id;
  };

  public shared ({ caller }) func updateSafeZone(id : ProfileId, name : Text, address : Text, latitude : Float, longitude : Float, radius : Nat, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update safe zones");
    };
    switch (safeZones.get(id)) {
      case (null) { Runtime.trap("Safe zone not found") };
      case (?existing) {
        requireChildOwnership(caller, existing.childId);
        let updated : SafeZone = {
          id;
          childId = existing.childId;
          name;
          address;
          latitude;
          longitude;
          radius;
          isActive;
        };
        safeZones.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteSafeZone(id : ProfileId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete safe zones");
    };
    switch (safeZones.get(id)) {
      case (null) { Runtime.trap("Safe zone not found") };
      case (?zone) {
        requireChildOwnership(caller, zone.childId);
        safeZones.remove(id);
      };
    };
  };

  public query ({ caller }) func getSafeZones(childId : ProfileId) : async [SafeZone] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view safe zones");
    };
    requireChildOwnership(caller, childId);
    safeZones.values().toArray().filter(func(zone) { zone.childId == childId });
  };

  // ScreenTimeRecords
  public shared ({ caller }) func addScreenTime(childId : ProfileId, appName : Text, category : Category, durationMinutes : Nat, date : Text) : async ProfileId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add screen time");
    };
    requireChildOwnership(caller, childId);
    if (not children.containsKey(childId)) { Runtime.trap("Child profile not found") };
    let id = generateProfileId();
    let record : ScreenTimeRecord = {
      id;
      childId;
      appName;
      category;
      durationMinutes;
      date;
    };
    screenTime.add(id, record);
    id;
  };

  public query ({ caller }) func getScreenTimeByDate(childId : ProfileId, date : Text) : async [ScreenTimeRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view screen time");
    };
    requireChildOwnership(caller, childId);
    screenTime.values().toArray().filter(func(rec) { rec.childId == childId and rec.date == date });
  };

  // ContentRecords
  public shared ({ caller }) func addContent(childId : ProfileId, url : Text, title : Text, category : Category, riskScore : Nat, flagged : Bool) : async ProfileId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add content records");
    };
    requireChildOwnership(caller, childId);
    if (not children.containsKey(childId)) { Runtime.trap("Child profile not found") };
    let id = generateProfileId();
    let record : ContentRecord = {
      id;
      childId;
      url;
      title;
      category;
      riskScore;
      flagged;
      timestamp = Time.now();
    };
    contentRecords.add(id, record);
    id;
  };

  // BullyingAlerts
  public shared ({ caller }) func addBullyingAlert(childId : ProfileId, platform : Text, severity : { #low; #medium; #high }, snippet : Text) : async ProfileId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add bullying alerts");
    };
    requireChildOwnership(caller, childId);
    let id = generateProfileId();
    let alert : BullyingAlert = {
      id;
      childId;
      platform;
      severity;
      snippet;
      timestamp = Time.now();
      status = #new;
    };
    bullyingAlerts.add(id, alert);
    id;
  };

  public shared ({ caller }) func updateAlertStatus(id : ProfileId, status : { #new; #reviewed; #dismissed }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update alerts");
    };
    switch (bullyingAlerts.get(id)) {
      case (null) { Runtime.trap("Alert not found") };
      case (?existing) {
        requireChildOwnership(caller, existing.childId);
        let updated : BullyingAlert = { existing with status };
        bullyingAlerts.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getAlertsByChild(childId : ProfileId) : async [BullyingAlert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view alerts");
    };
    requireChildOwnership(caller, childId);
    bullyingAlerts.values().toArray().filter(func(alert) { alert.childId == childId });
  };

  // SpendingRecords
  public shared ({ caller }) func addSpending(childId : ProfileId, amount : Nat, category : Text, merchant : Text) : async ProfileId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add spending records");
    };
    requireChildOwnership(caller, childId);
    let id = generateProfileId();
    let record : SpendingRecord = {
      id;
      childId;
      amount;
      category;
      merchant;
      timestamp = Time.now();
    };
    spendingRecords.add(id, record);
    id;
  };

  // AIRecommendation
  public shared ({ caller }) func addRecommendation(childId : ProfileId, tipType : Recommendation, content : Text, priority : Nat) : async ProfileId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add recommendations");
    };
    requireChildOwnership(caller, childId);
    let id = generateProfileId();
    let record : AIRecommendation = {
      id;
      childId;
      tipType;
      content;
      priority;
      createdAt = Time.now();
      isRead = false;
    };
    recommendations.add(id, record);
    id;
  };

  public shared ({ caller }) func markRecommendationRead(id : ProfileId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark recommendations");
    };
    switch (recommendations.get(id)) {
      case (null) { Runtime.trap("Recommendation not found") };
      case (?existing) {
        requireChildOwnership(caller, existing.childId);
        let updated : AIRecommendation = { existing with isRead = true };
        recommendations.add(id, updated);
      };
    };
  };

  // ParentSettings
  public shared ({ caller }) func updateSettings(notificationsEnabled : Bool, weeklyReportEnabled : Bool, alertThreshold : { #low; #medium; #high }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update settings");
    };
    let settings : ParentSettings = {
      parentId = caller;
      notificationsEnabled;
      weeklyReportEnabled;
      alertThreshold;
    };
    parentSettings.add(caller, settings);
  };

  public query ({ caller }) func getSettings() : async ParentSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view settings");
    };
    switch (parentSettings.get(caller)) {
      case (null) { Runtime.trap("Settings not found") };
      case (?settings) { settings };
    };
  };

  // Dashboard Summary
  public query ({ caller }) func getDashboardSummary(childId : ProfileId) : async DashboardSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard");
    };
    requireChildOwnership(caller, childId);
    if (not children.containsKey(childId)) { Runtime.trap("Child profile not found") };

    let todayScreenTime = screenTime.values().toArray().filter(func(rec) { rec.childId == childId }).foldLeft(0, func(acc, record) { acc + record.durationMinutes });

    let unreadAlertsCount = bullyingAlerts.values().toArray().filter(func(alert) { alert.childId == childId and alert.status == #new }).size();

    let todaySpendingTotal = spendingRecords.values().toArray().filter(func(rec) { rec.childId == childId }).foldLeft(0, func(acc, record) { acc + record.amount });

    var latestLocation : ?LocationRecord = null;
    for (location in locations.values()) {
      if (location.childId == childId) {
        switch (latestLocation) {
          case (null) { latestLocation := ?location };
          case (?existing) {
            if (location.timestamp > existing.timestamp) {
              latestLocation := ?location;
            };
          };
        };
      };
    };

    let unreadRecommendationsCount = recommendations.values().toArray().filter(func(rec) { rec.childId == childId and not rec.isRead }).size();

    {
      todayScreenTime;
      unreadAlertsCount;
      todaySpendingTotal;
      latestLocation;
      unreadRecommendationsCount;
    };
  };

  // Seed demo data
  public shared ({ caller }) func seedDemoData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed demo data");
    };
    ignore await addChild("John", 12, "John's Phone", "avatar_1.png");
    ignore await addChild("Anna", 10, "Anna's Tablet", "avatar_2.png");
  };
};
